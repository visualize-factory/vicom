#!/usr/bin/env node
/**
* @Author: disoul
* @Date:   2016-10-31T11:24:59+08:00
* @Last modified by:   disoul
* @Last modified time: 2016-11-04T11:14:11+08:00
*/

'use strict';
var childProcess = require('child_process');
var path = require('path');
var fs = require('fs');
var ejs = require('ejs');
var inquirer = require('inquirer');
var Utils = require('./libs/utils');

//环境相关的参数
var comsdir = process.cwd();
var libdir = path.resolve(comsdir, '../');
var comdir;

//建立问答
function checkName(name){
	if(!name) return '组件名不为空';
	if (/_/.test(name)) return '不允许存在下划线';
	var dir = path.join(comsdir, './' + name);
	if (fs.existsSync(dir)) return '该组件目录本地已存在!'
	return true;
}

function checkIsNull(v){
  if (!v) return '不允许为空';
  return true;
}

var questions = [{
	type: "input",
	name: "name",
	message: "组件名(EN)",
	validate: checkName
}, {
	type: "input",
	name: "nameCn",
	message: "组件名(CN)",
	validate: checkIsNull
}, {
	type: "input",
	name: "desc",
	message: "描述",
	validate: checkIsNull
}, {
	type: 'list',
	name: 'type',
	message: '请选择组件类型',
	choices: ['es5', 'react']
}, {
	type: "input",
	name: "username",
	default: process.env.USER || process.env.LOGNAME,
	message: "用户名,eg: zhouningyi",
	validate: checkIsNull
}];


function createDir(answers){
  if (answers.type === 'react') {
	  var e = fs.mkdirSync('./' + answers.Name);
    answers.dirname = answers.Name;
  } else {
	  var e = fs.mkdirSync('./' + answers.name);
    answers.dirname = answers.name;
  }
	if(e) console.log('新建文件夹时出错', e);
}


function writeFile(content, name, comName){
	var dir = path.join(comsdir, comName + '/' + name);
	fs.writeFileSync(dir, content, 'utf8');
}

function createFiles(answers){
	var dir = answers.name;
	var templateDir = path.resolve(__dirname, './com', answers.type);
	//
	var js = fs.readFileSync(path.resolve(templateDir, 'js.template'), 'utf8');
	writeFile(ejs.render(js, answers), 'index.js', dir);

  if (answers.type === 'react') {
    var jsx = fs.readFileSync(path.resolve(templateDir,'jsx.template'), 'utf8');
    writeFile(ejs.render(jsx, answers), answers.Name + '.jsx', dir);
  }

	var css = fs.readFileSync(path.resolve(templateDir, 'css.template'), 'utf8');
	writeFile(ejs.render(css, answers), 'index.css', dir);

	var pkg = fs.readFileSync(path.resolve(templateDir, 'pkg.template'), 'utf8');
	writeFile(ejs.render(pkg, answers), 'package.json', dir);
	//
	//
	var pubDir = path.resolve(__dirname, 'com/public');
	var gitignore = fs.readFileSync(path.resolve(pubDir, 'gitignore.template'), 'utf8');
	writeFile(ejs.render(gitignore, answers), '.gitignore', dir);

	//更新配置
	var config = {
    name: answers.dirname,
		com: path.resolve(process.cwd(), answers.dirname),
		comRelative: './coms/' + answers.dirname,
		html: path.resolve('../index.html')
	};
	writeFile(JSON.stringify(config, null, 2), '.vc-config.json', dir);
}

function ask() {
	inquirer.prompt(questions)
	.then(function(answers) {
    answers.Name = Utils.upperFirstChar(answers.name);
		comdir = path.join(comsdir, answers.name);
		console.log(comdir, 'comdir');
		//
		createDir(answers);
		createFiles(answers);
		//
		Utils.done('组件顺利生成，请在库目录安装所需依赖');
	});
}

/*
function next(){
  Utils.exec('cd ' + libdir + ' && cnpm i', function(){
    Utils.done('生成完成');
  });
}
*/
ask();
