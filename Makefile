version=

install:
	@cd /Users/zhouningyi/git/coms/glmap-react/components/CombineCom && cnpm install

publish:
	@cd /Users/zhouningyi/git/coms/glmap-react/components/CombineCom && npm publish
	@cnpm sync CombineCom
