#!/usr/bin/env node
var program = require('commander');
program
    .option('-c, --compile <file>', 'compile .scss file to its current folder')
    .option('-j, --jshint [path]', 'start jshint, use string or array with string in it to set path or file')
    .option('-s, --server [conf]', 'start local server at current path, default conf is ./kabi.json')
    .parse(process.argv);

if (program.compile) {
var scss = require('../script/scss');
    scss.compile(program.compile);
}

if (program.server) {
var server = require('../script/server');
    server.start(program.server);
}

if (program.jshint) {
var jshint = require('../script/jshint');
    jshint.check(program.jshint, program.args);
}
