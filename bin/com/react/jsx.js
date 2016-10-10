'use strict';
var Utils = require('./../../libs/utils');

module.exports = function(opt) {
	var name = Utils.upperFirstChar(opt.name);
	return Utils.signature(opt) + `

 'use strict';

  233
`;
};
