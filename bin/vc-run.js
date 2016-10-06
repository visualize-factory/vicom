#!/usr/bin/env node

'use strict';
const path = require('path');
const exec = require('child_process').exec;
const program = require('commander');

const ENV_PATH = path.join(__dirname, '..');

const WEBPACK_CONF = path.join(ENV_PATH, 'webpack.config.js');
var Utils = require('./libs/utils');

program
  // .option('-d, --dir [project dir]', '项目目录')
  .option('-p, --port [port]', '监听端口')
  .parse(process.argv);

const createServer = (port=8081, host='0.0.0.0') => {
  var cmd = `
    PORT=${port} \
    NODE_ENV=development \
      webpack-dev-server --hot --inline --progress --colors \
        --host ${host} \
        --port ${port} \
        --config ${WEBPACK_CONF}
  `;
  //
  Utils.done(`调试服务开启: http://${host}:${port}`);
  Utils.exec(cmd, function(err, stdout, stderr){
    if (err) throw err;
  });
}

createServer(program.port);
