#!/usr/bin/env node
var program = require('commander');
program
    .option('-c, --compile <file>', 'compile .scss file to its current folder')
    .option('-s, --server [conf]', 'start local server at current path, default conf is ./kabi.json')
    .parse(process.argv);

var scss = require('../script/scss');
if (program.compile) {
    scss.compile(program.compile);
}

var server = require('../script/server');
if (program.server) {
    server.start(program.server);
}
