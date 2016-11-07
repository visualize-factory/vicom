version=

install:
	@cd /Users/zhouningyi/git/coms/coms/force && cnpm install

publish:
	@cd /Users/zhouningyi/git/coms/coms/force && npm publish
	@cnpm sync force
