#!/usr/bin/env node
/**
* @Author: disoul
* @Date:   2016-10-31T11:24:59+08:00
* @Last modified by:   disoul
* @Last modified time: 2016-11-04T11:17:08+08:00
*/
'use strict';
var childProcess = require('child_process');
var process = require('process');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var os = require('os');
//
var Utils = require('./libs/utils');

var comdir = process.cwd();
var libdir = path.resolve(comdir, '../../');
var tooldir = path.resolve(__dirname, './../coms');
var toolRootDir = path.resolve(__dirname, './../');
var htmlDir = path.resolve(__dirname, './../index.html');
var cs = os.platform() === 'win32' ? comdir.split('\\') : comdir.split('\/');
var libName = cs[cs.length - 3];
var name = cs[cs.length - 1];
console.log('libName', libName);
var name = cs[cs.length - 1];
var config = {};

function createSoftLink() {
    try {
        fs.accessSync(tooldir, fs.constants.F_OK);
    } catch (err) {
        console.log('创建coms目录...');
        fs.mkdirSync(tooldir);
    }

  try {
    fs.accessSync(path.resolve(tooldir, libName), fs.constants.F_OK);
    console.log('链接存在，跳过');
  } catch(err) {
    console.log('创建链接', libdir, path.resolve(tooldir, libName));
    fs.symlinkSync(
      libdir,
      path.resolve(tooldir, libName),
      'dir'
    );
  }
}

function writeFile(name, content) {
    fs.writeFileSync(path.join(__dirname, './../' + name), content, 'utf8');
}

function updateFiles() {
  var config = {
    name: name,
    com: comdir,
    comRelative: './coms/' + libName + '/' + cs[cs.length-2] + '/' + name,
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
}
  // //读取配置
  //  fs.readFile(path.resolve(process.cwd(), '.vc-config.json'), function(err,data) {
  //    if (err) {
  //      console.log('适用默认的vc-config...');
  //      config =
  //      writeFile('.vc-config.json', JSON.stringify(config, null, 2));
  //    }
function mergeNodeModules() {
  var comPath = path.resolve(libdir, 'node_modules');
  console.log(comPath);
  var vcPath = path.resolve(__dirname, '../node_modules/');
  var linkList;

  try {
    linkList = fs.readFileSync(path.resolve(__dirname, '../.linklist'));
    linkList = linkList.toString().split('\n');
  } catch(err) {
    console.log('找不到.listlist',err);
    linkList = [];
  }

  console.log(linkList);
  console.log('清理node_modules link...');
  linkList.map(link => {
    if (link === '') return;
    try {
      fs.unlinkSync(path.resolve(vcPath, link));
      console.log('unlink', link);
    } catch(err) {
      console.log('not found', link, err);
    }
  });

  linkList = [];

  Utils.done('整合node_modules..');

  var comModules = fs.readdirSync(comPath);
  var vcModules = fs.readdirSync(vcPath);
  comModules.map(function(module) {
    if (vcModules.lastIndexOf(module) === -1) {
      linkList.push(module);
    }
  });

  writeFile('.linklist', linkList.join('\n'));

  linkList.map(module => {
    console.log('add module:' + module);
    fs.symlinkSync(
      path.resolve(comPath, module),
      path.resolve(vcPath, module),
      'dir'
    );
  });
}

//
function createServer() {
  var cmd = 'cross-env NODE_ENV=development webpack-dev-server --hot --inline --progress --colors --host 0.0.0.0 --port 8080 --config ' +
  path.join(toolRootDir, './webpack.config.js');

  Utils.exec(cmd, path.resolve(__dirname, '../'), function() {
      Utils.done('调试服务开启');
  });
}

createSoftLink();
updateFiles();
