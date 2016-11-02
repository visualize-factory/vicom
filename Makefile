version=

install:
	@cd /Users/disoul/Documents/lib/components/Demo2 && cnpm install

publish:
	@cd /Users/disoul/Documents/lib/components/Demo2 && npm publish
	@cnpm sync Demo2
