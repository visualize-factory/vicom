/*
* @Author: zhouningyi
* @Date:   2016-10-03 11:58:59
* @Last Modified by:   zhouningyi
* @Last Modified time: 2016-10-03 12:23:23
*/

var Utils = require('./../../libs/utils');
module.exports = function(opt) {
	var name = Utils.upperFirstChar(opt.name);
	return Utils.signature(opt) + `
	`;
};