
/**
 *  Server-side code of the video extension.
 *  @author Andy Wermke
 */

var ServerSettings = require('../keynode.js.server_settings');
var ServerData = require('../keynode.js.server_data');


var Video = this;

Video.data = {
    embedTag : {}       /// {"canonical URL": "embed tag HTML"}
};


/***
 *  @param io
 *      Socket.IO object
 *  @param socket
 *      Presenter socket
 */
Video.init = function (io, socket) {
    
    // Init the handlers for the video-related socket.io messages:
    
    socket.on('setVideoEmbedTag', function(data) {
        var canoURL = data.name;
        var html = data.html;
        if (ServerData.getAdmin(canoURL) === socket.id) {
            // Message comes from presenter:
            Video.data.embedTag[canoURL] = html;
            io.sockets.in(canoURL).emit('videoEmbedTag', html);
        } else {
            console.log("setVideoEmbedTag: Denied for socket "+socket.id+".");
        }
    });
    socket.on('getVideoEmbedTag', function(data) {
        var canoURL = data.name;
        var html = Video.data.embedTag[canoURL] ? Video.data.embedTag[canoURL] : null;
        socket.emit('videoEmbedTag', html);
    });
    
};

