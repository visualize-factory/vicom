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
  var config = {
    name: name,
    com: comdir,
    comRelative: './coms/' + name,
    html: path.join(__dirname, '../index.html')
  };
  writeFile('config.json', JSON.stringify(config, null, 2));
  switch (process.argv[2]) {
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
  mergeNodeModules();
  createServer();

  // //读取配置
  //  fs.readFile(path.resolve(process.cwd(), '.vc-config.json'), function(err,data) {
  //    if (err) {
  //      console.log('适用默认的vc-config...');
  //      config = 
  //      writeFile('.vc-config.json', JSON.stringify(config, null, 2));
  //    }

  //    config = JSON.parse(data);

  //    var projType = process.argv[2];

  //    switch(process.argv[2]) {
  //      case 'react':
  //        var js = fs.readFileSync(path.resolve(__dirname, './src/react.template'), 'utf8');
  //        writeFile('index.js', ejs.render(js, config));
  //        break;
  //      case 'es5':
  //      default:
  //        var js = fs.readFileSync(path.resolve(__dirname, './src/js.template'), 'utf8');
  //        writeFile('index.js', ejs.render(js, config));
  //        var makefile = fs.readFileSync(path.resolve(__dirname, './src/makefile.template'), 'utf8');
  //        writeFile('Makefile', ejs.render(makefile, config));
  //    }
  //    mergeNodeModules();
  //    createServer();
  //  });
}

function mergeNodeModules() {
  var comPath = path.resolve(process.cwd(), 'node_modules');
  console.log(comPath);
  var vcPath = path.resolve(__dirname, '../node_modules/');
  var comModules = fs.readdirSync(comPath);
  var vcModules = fs.readdirSync(vcPath);
  
  Utils.done('整合node_modules..');

  comModules.map(function(module) {
    if (vcModules.lastIndexOf(module) === -1) {
      console.log('add module:' + module);
      fs.symlinkSync(
        path.resolve(comPath, module),
        path.resolve(vcPath, module)
      );
    }
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

