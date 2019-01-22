var md = require('markdown-it')({
    html: true
}).use(require('markdown-it-highlightjs'));
var path = require('path');
var fs = require('fs');


var compile = function(file) {
    var name = (file.indexOf('.md') === -1)?(file + '.md'):file;
    var filePath = path.resolve(name);
    console.log('Target: ' + filePath);
    console.log('Check file');
    if (fs.existsSync(filePath)) {
        console.log('Read file');
        var fileContent = fs.readFileSync(filePath, 'utf-8');
        var fileNameArray = filePath.split('.');
        fileNameArray.pop();
        fileNameArray.push('html');
        var newFilePath = fileNameArray.join('.');
        console.log('Render and write');
        fs.writeFileSync(newFilePath, md.render(fileContent));
        console.log('Done');
    } else {
        console.log('File dose not exist');
    }
};

module.exports = {
    compile: compile
}; 
