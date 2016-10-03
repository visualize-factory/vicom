#!/usr/bin/env node

'use strict';

var cmd = require('commander');
var pkg = require('./../package.json');


cmd
.version('v' + pkg.version)
.command('run',  '启动组件(当前目录)')
.command('init', '新建组件')
.parse(process.argv);

