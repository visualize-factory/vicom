#!/usr/bin/env node

'use strict';
var childProcess = require('child_process');
var process = require('process');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
//
var Utils = require('./libs/utils');

var comdir = process.cwd();
var tooldir = path.join(__dirname, './../coms');
var toolRootDir = path.join(__dirname, './../');
var htmlDir = path.join(__dirname, './../index.html');
var cs = comdir.split('\/');
var name = cs[cs.length - 1];

var config = {};

function createSoftLink() {
	childProcess.exec('ln -s ' + comdir + ' ' + tooldir);
}
//
function writeFile(name, content) {
	fs.writeFileSync(path.join(__dirname, './../' + name), content, 'utf8');
}

function updateFiles() {
	//读取配置
  fs.readFile(path.resolve(process.cwd(), 'config.json'), function(err,data) {
    if (err) {
      console.error(err);
      console.error('无法读取config.json，请确认路径是否正确');
    }

    config = JSON.parse(data);
    var projType = process.argv[2];
    switch(process.argv[2]) {
      case 'react':
        var js = fs.readFileSync(path.resolve(__dirname, './src/react.template'), 'utf8');
        writeFile('index.js', ejs.render(js, config));
        break;
      case 'es5':
      default:
        var js = fs.readFileSync(path.resolve(__dirname, './src/js.template'), 'utf8');
        writeFile('index.js', ejs.render(js, config));
        var makefile = fs.readFileSync(path.resolve(__dirname, './src/makefile.template'), 'utf8');
        writeFile('Makefile', ejs.render(makefile, config));
    }

    createServer();
  });
}

//
function createServer() {
	var cmd = 'NODE_ENV=development webpack-dev-server --hot --inline --progress --colors --host 0.0.0.0 --port 8080 --config ' + 
	path.join(toolRootDir, './webpack.config.js');
	//
	Utils.exec(cmd, path.resolve(__dirname, '../'), function(){
		Utils.done('调试服务开启');
	});
}

createSoftLink();
updateFiles();

