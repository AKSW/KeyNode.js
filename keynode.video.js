
var VideoAddon = {
    socketEventsBound : false,
    
    $embedContainer : null,
    embedHTML : null
};


$(document).bind('watcher.init', function() {
    $('body').append(
        VideoAddon.$embedContainer = $('<div id="video-container"></div>')
    );
});

$(document).bind('watcher.bindSocketEvents', function() {
    if(VideoAddon.socketEventsBound)
        return;
    
    var socket = mysocket.getSocket();
    if(!socket)     // is triggered multiple times by the presenter
        return;
    
    socket.on('videoEmbedTag', function(html) {
        if(html == VideoAddon.embedHTML)
            return;
        
        VideoAddon.embedHTML = html;
        VideoAddon.$embedContainer.html(html);
    });
    VideoAddon.socketEventsBound = true;
});

$(document).bind('watcher.setOnline', function() {
    
});

