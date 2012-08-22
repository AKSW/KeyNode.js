
/**
 *  Server-side code of the video extension.
 *  @author Andy Wermke
 */

var ServerSettings = require('../keynode.js.server_settings');
var ServerData = require('../keynode.js.server_data');

var crypto = require(ServerSettings.cryptoPackage || "crypto");
var extensionFileServer = require('./fileserver');


var Video = this;

Video.data = {
    embedTag : {},      /// {"canonical URL": "embed tag HTML", ...},
    currentToken : {}   /// {"canonical URL": "token", ...}
};



/**
 *	Set up the handler for the Google Hangout extension callback.
 *  Usage: GET /videoYouTubeLiveId?token=<Token>&liveid=<YouTube Live Id>
 */

Video.init = function (io, fileServer) {
    fileServer.setFileHandler('/videoYouTubeLiveId', function(reqData, req, res) {
        var token = reqData.query.token,
            liveId = reqData.query.liveid;
        
        if(!token || !liveId) {
            return fail("Missing neccessary parameters");
        }
        
        var match = false, canoURL;
        for(canoURL in Video.data.currentToken) {
            if(Video.data.currentToken[canoURL] == token) {
                match = true;
                break;
            }
        }
        if(!match) {
            return fail("Bad token");
        }
        
        
        // Everything is fine:
        
        liveId = liveId.replace(/[^A-Za-z0-9_-]/, '');        // just for security purposes
        
        console.log("Received YouTube Live Id: "+liveId+" ("+canoURL+")");
        Video.data.currentToken[canoURL] = null;
        Video.setVideoEmbedTag(io, canoURL, '<iframe width="420" height="315" src="http://www.youtube.com/embed/'+liveId+'" frameborder="0" allowfullscreen="allowfullscreen"></iframe>');
        
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/plain'
        });
        res.write("Success");
        res.end();
        return true;
        
        
        function fail (message) {
            res.writeHead(400, {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'text/plain'
            });
            res.write(message);
            res.end();
        }
    });
};


/**
 *  @param io
 *      Socket.IO object
 *  @param socket
 *      Presenter socket
 */
Video.initSocket = function (io, socket) {
    
    // Init the handlers for the video-related socket.io messages:
    
    socket.on('disconnect', function() {
        var canoURL = ServerData.getCanoURLByAdminSocketId(socket.id);
        if(!canoURL)    // return if canoURL==null => this socket is not a presenter socket
            return;
        
        // Reset video embed code, but do not broadcast it
        // So the still connected watchers may keep watching, but new watchers
        // will not receive a most-likely obsolete embed code
        Video.data.embedTag[canoURL] = undefined;
    });
    
    socket.on('setVideoEmbedTag', function(data) {
        var canoURL = data.name;
        var html = data.html;
        if (ServerData.getAdmin(canoURL) === socket.id) {
            // Message comes from presenter:
            // Do broadcast:
            Video.setVideoEmbedTag(io, canoURL, html);
        } else {
            console.log("setVideoEmbedTag: Denied for socket "+socket.id+".");
        }
    });
    socket.on('getVideoEmbedTag', function(data) {
        var canoURL = data.name;
        var html = Video.data.embedTag[canoURL] ? Video.data.embedTag[canoURL] : null;
        socket.emit('videoEmbedTag', html);
    });

    
    socket.on('generateVideoAuthToken', function(canoURL) {
        var data = {
            token : Video.generateAuthToken(canoURL),
            url : '/videoYouTubeLiveId'
        };
        socket.emit('videoAuthToken', data);
    });
    
};


/**
 *  Broadcast HTML code for embedding a video.
 */
Video.setVideoEmbedTag = function (io, canoURL, html) {
    Video.data.embedTag[canoURL] = html;
    io.sockets.in(canoURL).emit('videoEmbedTag', html);
};


/**
 *  Generates a random security token and returns it. This token can be used to
 *  authenticate the Google Hangout extension when it passes the YouTube Live Id.
 *
 *  @return Token
 */
Video.generateAuthToken = function (canoURL) {
    var randomBytes = crypto.randomBytes(50);
    var hash = crypto.createHash('md5');
    
    hash.update(randomBytes);
    return Video.data.currentToken[canoURL] = hash.digest('hex');
};


