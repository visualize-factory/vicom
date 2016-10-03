#!/usr/bin/env node

'use strict';

var cmd = require('commander');
var pkg = require('./../package.json');


cmd
.version('v' + pkg.version)
.command('run', '启动组件')
.parse(process.argv);

