
var VideoAddon = {
    // Data:
    socketEventsBound : false,
    embedHTML : null,
    
    // String tables:
    lang : {
        de : {
            containerTitle: "Video"
        },
        en : {
            containerTitle: "Video"
        }
    },
    
    // Logic:
    init : function () {
        if (navigator.language.indexOf("de") > -1) {
            VideoAddon.strings = VideoAddon.lang.de;
        } else {
            VideoAddon.strings = VideoAddon.lang.en;
        }
    }
};



var VideoContainer = {
    $container : null,
    slideState : false,
    
    init : function () {
        var strings = VideoAddon.strings;
        var $h2, $video;
        
        // create container:
        VideoContainer.$container = $('<div id="video-container"></div>');
        VideoContainer.$container.append(
            $h2    = $('<h2></h2>').text( strings.containerTitle ),
            $video = $('<div class="video"></div>').hide()
        );
        
        // add container to the <body>:
        $('body').append( VideoContainer.$container );
        
        // hide container for now:
        VideoContainer.$container.hide();
        
        // set click handler:
        $h2.click(VideoContainer.slideVideo);
    },
    
    show : function () {
        VideoContainer.$container.stop().fadeIn(400);
    },
    
    hide : function () {
        VideoContainer.$container.stop().fadeOut(400);
    },
    
    setEmbedHTML : function (html) {
        VideoContainer.$container.find('> .video').html(html);
    },
    
    slideVideo : function () {
        var $h2    = VideoContainer.$container.find('> h2'),
            $video = VideoContainer.$container.find('> .video'),
            h2MinOpacity = 0.3;
        
        if(!VideoContainer.slideState) {
            // Video is not visible:
            $video.stop().slideDown(400);
            $h2.animate({opacity: h2MinOpacity}, 400);
            $h2.mouseenter(function() {
                $h2.stop().animate({opacity: 1}, 200);
            });
            $h2.mouseleave(function() {
                $h2.stop().animate({opacity: h2MinOpacity}, 200);
            });
            VideoContainer.slideState = true;
            
        } else {
            
            // Video is visible:
            $video.stop().slideUp(400);
            $h2.animate({opacity: 1}, 400);
            $h2.unbind('mouseenter').unbind('mouseleave');
            VideoContainer.slideState = false;
        }
    }
};



VideoAddon.init();

$(document).bind('watcher.init', function() {
    
    // include stylesheet:
    if( $('head > link[rel="stylesheet"][href*="keynode.video.css"]').size() == 0 ) {
        $('head').append(
            $('<link rel="stylesheet" type="text/css" href="css/keynode.video.css" />')
        );
    }
    
    // init video container:
    VideoContainer.init();
});


$(document).bind('watcher.bindSocketEvents', function() {
    if(VideoAddon.socketEventsBound)
        return;
    
    var socket = mysocket.getSocket();
    if(!socket)     // is triggered multiple times by the presenter
        return;
    
    // Handle 'videoEmbedTag' message:
    socket.on('videoEmbedTag', function(html) {
        if(html == VideoAddon.embedHTML)
            return;
        
        VideoAddon.embedHTML = html;
        
        if(html) {
            VideoContainer.show();
            VideoContainer.setEmbedHTML(html);
        } else {
            VideoContainer.hide();
        }
    });
    
    VideoAddon.socketEventsBound = true;
});


$(document).bind('watcher.setOnline', function() {
    var socket = mysocket.getSocket();
    
    // request video embed information: (requests the server to send a 'videoEmbedTag' message to this client)
    socket.emit('getVideoEmbedTag', {name: CanonicalURL});
});

