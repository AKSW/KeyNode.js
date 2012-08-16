var VideoAddon = {
    lang : {
        de : {
            containerTitle: "Video",
            option_embedHTML_label: "HTML-Code zur Videoeinbettung"
        },
        en : {
            containerTitle: "Video",
            option_embedHTML_label: "HTML code to embed videos"
        }
    },
    
    init : function () {
        
    }
};

var VideoContainer = {
    $container : null,
    slideState : false,
    
    init : function () {
        var $h2, $options;
        
        // init strings:
        if (navigator.language.indexOf("de") > -1) {
            VideoAddon.strings = VideoAddon.lang.de;
        } else {
            VideoAddon.strings = VideoAddon.lang.en;
        }
        
        // create container <div>:
        VideoContainer.$container = $('<div id="video-container-presenter"></div>');
        VideoContainer.$container.append(
            $h2      = $('<h2></h2>').text(VideoAddon.strings.containerTitle),
            $options = $('<div class="options"></div>').hide()
        );
        $('body').append( VideoContainer.$container );
        
        // bind click handler:
        $h2.click(VideoContainer.slideToggle);
        
        // add options:
        $options.append(
            $('<div class="option"></div>').append(
                $('<label for="embedHTML"></label>').text(VideoAddon.strings.option_embedHTML_label),
                $('<input id="embedHTML" type="text" />'),
                $('<input type="button" value="&gt;" />').click(VideoContainer.setOption_embedHTML)
            )
        );
    },
    
    slideToggle : function () {
        var $h2      = VideoContainer.$container.find('> h2'),
            $options = VideoContainer.$container.find('> .options'),
            h2MinOpacity = 0.3;
        
        if(!VideoContainer.slideState) {
            // Video is not visible:
            $options.stop().slideDown(400);
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
            $options.stop().slideUp(400);
            $h2.animate({opacity: 1}, 400);
            $h2.unbind('mouseenter').unbind('mouseleave');
            VideoContainer.slideState = false;
        }
    },
    
    setOption_embedHTML : function () {
        var socket = mysocket.s[0];
        var html = VideoContainer.$container.find('#embedHTML').val();
        socket.emit('setVideoEmbedTag', {name: login.canoURL, html: html});
    }
};

setTimeout(function() {
    VideoAddon.init();
    VideoContainer.init();
}, 500);

