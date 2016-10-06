
version=

install:
	@cd /Users/eason/Work/Git/Za/vicom && cnpm install

publish:
	@cd /Users/eason/Work/Git/Za/vicom && npm publish
	@cnpm sync vicom
