
version=

install:
	@cd /Users/zhouningyi/git/coms/ss && cnpm install

publish:
	@cd /Users/zhouningyi/git/coms/ss && npm publish
	@cnpm sync ss
