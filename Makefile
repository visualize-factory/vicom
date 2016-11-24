version=

install:
	@cd /Users/zhouningyi/git/coms/test/components/timeline && cnpm install

publish:
	@cd /Users/zhouningyi/git/coms/test/components/timeline && npm publish
	@cnpm sync timeline
