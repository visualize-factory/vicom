version=

install:
	@cd /Users/disoul/Documents/es5example && cnpm install

publish:
	@cd /Users/disoul/Documents/es5example && npm publish
	@cnpm sync es5example
