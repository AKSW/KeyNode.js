var ServerSettings = require('../keynode.js.server_settings');

var fs = require(ServerSettings.fsPackage || "fs");
var url = require(ServerSettings.urlPackage || "url");
var static = require(ServerSettings.nodeStatic || 'node-static');
var file = new static.Server(ServerSettings.webRoot || "./public", { cache: 0 });


var FileServer = function () {
    this.port = 80;
    this.httpServer = null;
    this.fileHandlers = {};
};

FileServer.prototype = {
    listen : function (port) {
        var that = this;
        
        if(port)
            this.port = port;
        this.httpServer = require(ServerSettings.httpPackage || "http").createServer();
        
        this.httpServer.on('request', function(req, res) {                        
            var uri = url.parse(req.url, true),
                
                handler = that.fileHandlers[uri.pathname];
            
            if(handler) {
                //if Handler exists (Hangouts)
                return handler(uri, req, res);
            }else{
                req.addListener('end', function () {
                    file.serve(req, res);
                }).resume();  
            };
        });
        
        this.httpServer.listen(this.port);
    },
    
    close : function (callback) {
        return this.httpServer.close(callback);
    },
    
    getHTTPServer : function () {
        return this.httpServer;
    },
    
    /**
     *  Set up a handler for a certain file. It will be called every time
     *  this file is requested.
     *  @param path
     *      String, indicating file path on server. E.g. '/path/to/file'
     *  @param handler
     *      function(url, req, res)
     *      url - URL object as returned by url.parse()
     *      req - HTTPRequest object
     *      res - HTTPResponse object
     */
    setFileHandler : function (path, handler) {
        this.fileHandlers[path] = handler;
    }
};


function createServer (port) {
    var server = new FileServer();
    if(port)
        server.listen(port);
    return server;
}


exports = module.exports = {
    createServer : createServer,
    FileServer : FileServer
};

