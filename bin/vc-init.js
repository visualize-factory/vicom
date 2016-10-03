#!/usr/bin/env node

'use strict';
var childProcess = require('child_process');
var path = require('path');
var fs = require('fs');
var inquirer = require('inquirer');
var Utils = require('./libs/utils');

//环境相关的参数
var comsdir = process.cwd();
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
	var e = fs.mkdirSync('./' + answers.name);
	if(e) console.log('新建文件夹时出错', e);
}

function createFiles(answers){
	var type = answers.type;
	if (type === 'es5') return createES5Files(answers);
	if (type === 'react') return createReactFiles(answers);
}

function writeFile(content, name, comName){
	var dir = path.join(comsdir, comName + '/' + name); 
	fs.writeFileSync(dir, content, 'utf8');
}

function createES5Files(answers){
	var dir = answers.name;
	var es5dir = './com/es5/';
	//
	var js = require(es5dir + 'js')(answers);
	writeFile(js, 'index.js', dir);
	var css = require(es5dir + 'css')(answers);
	writeFile(css, 'index.css', dir);

	var pkg = require(es5dir + 'pkg')(answers);
	writeFile(pkg, 'package.json', dir);
	//
	//
	var pubdir = './com/public/';
	var gitignore = require(pubdir + 'gitignore');

	writeFile(gitignore, '.gitignore', dir);
}

function createReactFiles(){
}

function ask(next) {
	inquirer.prompt(questions)
	.then(function(answers) {
		comdir = path.join(comsdir, answers.name);
		console.log(comdir, 'comdir');
		//
		createDir(answers);
		createFiles(answers);
		//
		Utils.done('组件顺利生成');
		setTimeout(next, 500);
	});
}

function next(){
	Utils.exec('subl ./', function(){
		Utils.exec('open ' + comdir, function(){
			Utils.exec('cd ' + comdir + ' && cnpm i', function(){
				Utils.done('组件顺利生成');
			})
		});
	});
}

ask(next);

