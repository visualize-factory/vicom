
'use strict';
var config = require('./../../config.json');
var name = config.name;
var comPath = config.com;

module.exports = `
version=

install:
	@cd ${comPath} && cnpm install

publish:
	@cd ${comPath} && npm publish
	@cnpm sync ${name}
`;