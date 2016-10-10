var fs = require('fs');
var path = require('path');
var cp = require('child_process');
var Utils = require('./bin/libs/utils');

//让版本号+1
function verionPlus(version) {
	var ns = version.split('.');
	var n = ns[2];
	n = parseInt(n, 10);
	if (n >= 99) process.exit('版本号超过100');
	ns[2] = n + 1;
	return ns.join('.');
}

function writeFile(pth, json) {
	fs.writeFileSync(pth, JSON.stringify(json, null, 2), 'utf8');
}

function updatePkg() {
	var packageUrl = path.join(__dirname, './package.json');
	var package = fs.readFileSync(packageUrl);
	package = JSON.parse(package);

	package.version = verionPlus(package.version);
	writeFile(packageUrl, package);
	Utils.print('package.json已更新, 开始发布...', 'yellow');
}


//
var exec = Utils.exec;

function publish(){
	exec('npm publish', function() {
		Utils.print('已发布npm, 开始同步cnpm...\n', 'yellow');
		exec('cnpm sync vicom', function() {
			Utils.print('已同步cnpm, 开始本地安装...\n', 'yellow');
			exec('npm i vicom -g', function() {
	     Utils.print('已更新全局vicom...\n', 'yellow');
	     Utils.done('更新vicom版本');			
	    });
		});
	});
}


updatePkg();
publish();

