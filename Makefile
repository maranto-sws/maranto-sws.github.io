clean:
	$(RM) -r ./dist/

install:
	yarn

build: install
	yarn run gridsome build