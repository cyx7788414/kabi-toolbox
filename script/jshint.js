var gulp = require('gulp');
var jshint = require('gulp-jshint');

var check = function(src, args) {
    gulp.src(src)
        .pipe(jshint())        
        .pipe(jshint.reporter('default'));
};

var jshintTool = {
    check: check
};

module.exports = jshintTool;
