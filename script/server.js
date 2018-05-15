var http = require('http');
var httpProxy = require('http-proxy');
var path = require('path');
var fs = require('fs');
var mime = require('mime');

var conf;

var respondFile = function(requestPath, request, response) {
    console.log('SEND: ' + requestPath);
    var readStream = fs.createReadStream(requestPath);
    response.setHeader('Content-Type', mime.getType(requestPath))
    readStream.pipe(response);
};

var routeHandler = function(requestPath, request, response, proxyList) {
    if (proxyList && proxyList.length > 0) {
        var proxyFlag = false;
        for (var x = 0; x < proxyList.length; x++) {
            if (request.url.indexOf(proxyList[x].proxyConf.url) >= 0) {
                console.log('\nPROXY INFO: \nurl: ' + request.url + '\ntarget: ' + proxyList[x].proxyConf.target + '\n');
                var option = {
                    secure: false,
                    target: proxyList[x].proxyConf.target,
                    headers: {
                    }
                };
                if (proxyList[x].proxyConf.host) {
                    option.headers.host = proxyList[x].proxyConf.host;
                }
                proxyList[x].proxyInstance.web(request, response, option);
                proxyFlag = true;
                break;
            }
        }
        if (proxyFlag) {
            return;
        }
    }
    if (requestPath[requestPath.length - 1] === '/') {
        requestPath += 'index.html';
    }
    fs.stat(requestPath, function(error, stsat) {
        if (!error) {
            respondFile(requestPath, request, response);
        } else {
            console.log('\nNO FILE ERROR: \n' + 'url: ' + request.url + '\nrequestPath: ' + requestPath + '\n');
            response.writeHead(404, {
                'Content-Type': 'text/html'
            });
            response.end(`<h1>Not Found</h1><p>The requested URL ${request.url} was not found on this server.</p>`);
        }
    });
};

var getProxyList = function(conf) {
    if (!conf.proxy || conf.proxy.length === 0) {
        return [];
    }
    var list = [];
    for (var x = 0; x < conf.proxy.length; x++) {
        var proxyConf = conf.proxy[x];
        var proxy = {
            proxyConf: proxyConf,
            proxyInstance: httpProxy.createProxyServer({})
        };
        proxy.proxyInstance.on('error', function(error) {
            console.log('\nPROXY ERROR: \n' + error + '\n');
        });
        list.push(proxy);
    }
    return list.sort(function(a, b) {
        return b.proxyConf.url.length - a.proxyConf.url.length;
    });
};

var startServer = function(conf) {
    var port = (conf.server&&conf.server.port)?conf.server.port:80;
    
    var proxyList = getProxyList(conf);
    var serverInstance = http.createServer(function(request, response) {
        var requestPath = '.' + path.normalize(request.url);
        routeHandler(requestPath, request, response, proxyList);
    }).listen(port, function(error) {
        if (error) {
            console.log('START SERVER ERROR: \n' + error);
            return;
        } else {
            console.log('Server started on port ' + port);
        }
    });
}

var server = {
    start: function(confFile) {
        confFile = (confFile !== true)?confFile:'./.kabi.json';
        console.log(confFile);
        var confPath = path.resolve(process.cwd(), confFile);
        fs.readFile(confPath, 'utf8', function(error, data) {
            if (error) {
                console.log('HANDLE JSON CONF ERROR: \n' + error);
                return;
            }
            try {
                conf = JSON.parse(data);
            } catch(err) {
                console.log('HANDLE JSON CONF ERROR: \n' + err);
                return;
            }
            startServer(conf);
        });
    }
};

module.exports = server;
