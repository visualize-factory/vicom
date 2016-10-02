
version=

install:
	@cd /Users/zhouningyi/git/tools/test && cnpm install

publish:
	@cd /Users/zhouningyi/git/tools/test && npm publish
	@cnpm sync test
