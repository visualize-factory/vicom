#!/usr/bin/env node

'use strict';
var childProcess = require('child_process');
var path = require('path');
var fs = require('fs');
var script = require('./script');

var comdir = process.cwd();
var tooldir = path.join(__dirname, './../src');
var toolRootDir = path.join(__dirname, './../');
var htmlDir = path.join(__dirname, './../index.html');


var cs = comdir.split('\/');
var comName = cs[cs.length -1];

childProcess.exec('ln -s ' + comdir + ' ' + tooldir);

//
var content = JSON.stringify({
	com: comdir,
	comRelative: './src/' + comName,
	html: htmlDir
}, null, 2);
fs.writeFileSync(path.join(__dirname, './../config.json'), content, 'utf8');

fs.writeFileSync(path.join(__dirname, './../index.js'),  script, 'utf8');

//执行
var wcfg = path.join(toolRootDir, './webpack.config.js');
childProcess.exec('NODE_ENV=development webpack-dev-server --hot --inline --progress --colors --host 0.0.0.0 --port 8080 --config ' + wcfg);