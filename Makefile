version=

install:
	@cd /Users/zhouningyi/git/coms/graph/components/circles && cnpm install

publish:
	@cd /Users/zhouningyi/git/coms/graph/components/circles && npm publish
	@cnpm sync circles
