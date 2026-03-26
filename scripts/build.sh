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

echo "==> Copying public-facing files..."

copy_if_exists "index.html"
copy_if_exists "404.html"
copy_if_exists "assets"
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
