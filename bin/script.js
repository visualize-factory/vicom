
'use strict';

var config = require('./../config.json');
var indexURL = config.comRelative;

module.exports = `
var Com = require('${indexURL}');
new Com();
`;