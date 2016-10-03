var chalk = require('chalk');
var ascii = require('./ascii');

function print(str, type){//type 可以为 green red yellow等
  console.log(chalk[type](str + '\n'));
}

//执行完一个大任务时候执行
function done(str){
	var n = str.length;
	var str = ascii.createLogo(str + ' | ' + 'powerd by Vicom', n);
	return print(str, 'yellow');
}

function upperFirstChar(name) {//首字母大写
	if (!name) return 'Com';
	return name[0].toUpperCase() + name.substring(1, name.length);
}

function signature(opt){//生成文件头部的签名
	return `
/*
* @Author: ${opt.username}
* @Date:   ${new Date().toLocaleString()}
*/
`;
}

module.exports = {
	upperFirstChar: upperFirstChar,
	signature: signature,
	print: print,
	done: done,
};