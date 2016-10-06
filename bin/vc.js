#!/usr/bin/env node

'use strict';

var cmd = require('commander');
var pkg = require('./../package.json');


cmd
  .command('init', '新建组件')
  .command('link', '全局组件')
  .command('publish', '发布组件')
  .command('run',  '启动组件(当前目录)')
  .version('v' + pkg.version)
  .parse(process.argv);

