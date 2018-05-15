var nodeSass = require('node-sass');
var path = require('path');
var fs = require('fs');

var scss = {
    compile: function(filename) {
        var filePath = path.resolve(process.cwd(), filename);
        var outputFilePath = path.dirname(filePath) + '/' + path.basename(filePath, '.scss');
        var outputCSS = outputFilePath + '.css';
        var outputMap = outputFilePath + '.css.map';
        nodeSass.render({
            file: filePath,
            outFile: outputCSS,
            outputStyle: 'compressed',
            sourceMap: true
        }, function(error, result) {
            if (error) {
                console.log('SCSS RENDER ERROR: \n' + filePath);
                console.log('ERROR: ' + error);
            }
            fs.writeFile(outputCSS, result.css, function(err){
                if(err) {
                    console.log('CSS WRITEN ERROR: \n' + outputCSS);
                    console.log('ERROR: ' + err);
                }
            });
            fs.writeFile(outputMap, result.map, function(err){
                if(err) {
                    console.log('MAP WRITEN ERROR: \n' + outputMap);
                    console.log('ERROR: ' + err);
                }
            });
        });
    }
};

module.exports = scss;
