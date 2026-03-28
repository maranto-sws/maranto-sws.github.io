#!/usr/bin/env bash
# Build script for maranto-sws.github.io
# Copies only public-facing files into dist/ for deployment.
# Usage: bash scripts/build.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST="$REPO_ROOT/dist"

echo "==> Cleaning dist/"
rm -rf "$DIST"
mkdir -p "$DIST"

copied=()
skipped=()

copy_if_exists() {
  local src="$REPO_ROOT/$1"
  local label="${2:-$1}"
  if [ -e "$src" ]; then
    cp -r "$src" "$DIST/"
    copied+=("$label")
  else
    skipped+=("$label (not found, skipped)")
  fi
}

echo "==> Generating Tailwind CSS..."
npx tailwindcss \
  --config "$REPO_ROOT/tailwind.config.js" \
  --input  "$REPO_ROOT/assets/css/input.css" \
  --output "$REPO_ROOT/assets/css/tailwind.css" \
  --minify

echo ""
echo "==> Copying public-facing files..."

copy_if_exists "index.html"
copy_if_exists "404.html"
copy_if_exists "assets"

echo ""
echo "==> Inlining Tailwind CSS into HTML files..."
CSS_CONTENT="$(cat "$REPO_ROOT/assets/css/tailwind.css")"
for html_file in "$DIST/index.html" "$DIST/404.html"; do
  if [ -f "$html_file" ]; then
    # Replace <link rel="stylesheet" href="/assets/css/tailwind.css" /> with inline <style>
    python3 - "$html_file" "$CSS_CONTENT" <<'PYEOF'
import sys, pathlib
path = pathlib.Path(sys.argv[1])
css  = sys.argv[2]
html = path.read_text()
html = html.replace(
    '  <!-- Tailwind CSS (generated at build time) -->\n  <link rel="stylesheet" href="/assets/css/tailwind.css" />',
    f'  <style>{css}</style>'
)
path.write_text(html)
PYEOF
    echo "    + inlined CSS into $(basename "$html_file")"
  fi
done
copy_if_exists "robots.txt"
copy_if_exists "humans.txt"
copy_if_exists "CNAME"
copy_if_exists "sitemap.xml"

echo ""
echo "==> Build complete. Output: dist/"
echo ""

if [ ${#copied[@]} -gt 0 ]; then
  echo "  Copied:"
  for f in "${copied[@]}"; do
    echo "    + $f"
  done
fi

if [ ${#skipped[@]} -gt 0 ]; then
  echo ""
  echo "  Skipped:"
  for f in "${skipped[@]}"; do
    echo "    - $f"
  done
fi

echo ""
echo "  dist/ contents:"
ls -1 "$DIST"
