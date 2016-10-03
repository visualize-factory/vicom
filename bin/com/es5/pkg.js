'use strict';

module.exports = function(opt) {
  return `
  {
    "author": "${opt.username}",
    "name": "${opt.name}",
    "description": "${opt.desc}",
    "repository": {
      "type": "git"
     },
    "version": "0.0.1",
    "scripts": {
    },
    "dependencies": {
      "bcore": "*",
      "lodash": "^3.10.0"
    },
    "devDependencies": {
      "dat-gui": "^0.5.0"
    }
   }
  `;
};