#!/usr/bin/env node

'use strict';
var childProcess = require('child_process');
var path = require('path');
var fs = require('fs');

var comdir = process.cwd();
var tooldir = path.join(__dirname, './../src');
var toolRootDir = path.join(__dirname, './../');
var htmlDir = path.join(__dirname, './../index.html');
var cs = comdir.split('\/');
var comName = cs[cs.length - 1];


function createSoftLink() {
	childProcess.exec('ln -s ' + comdir + ' ' + tooldir);
}

function updateFiles() {
	//更新配置
	var config = {
		name: comName,
		com: comdir,
		comRelative: './src/' + comName,
		html: htmlDir
	};
	writeFile('config.json', JSON.stringify(config, null, 2));
	//更新文件
	var js = require('./src/script');
	writeFile('index.js', js);
	var makefile = require('./src/makefile');
	writeFile('Makefile', makefile);
}

function writeFile(name, content) {
	fs.writeFileSync(path.join(__dirname, './../' + name), content, 'utf8');
}


function createServer() {
	var wcfg = path.join(toolRootDir, './webpack.config.js');
	childProcess.exec('NODE_ENV=development webpack-dev-server --hot --inline --progress --colors --host 0.0.0.0 --port 8080 --config ' + wcfg);
}

createSoftLink();
updateFiles();
createServer();