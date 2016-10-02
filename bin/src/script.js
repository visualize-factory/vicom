
'use strict';

var config = require('./../../config.json');
var indexURL = config.comRelative;

module.exports = `
require('./index.css');
var Com = require('${indexURL}');
var container = document.getElementById('container')
new Com(container);
`;