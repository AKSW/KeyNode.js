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
        var socket = mysocket.s[0];
        
        socket.on('videoEmbedTag', function(html) {
            VideoContainer.updateEmbedCodeInput(html);
        });
        
        socket.on('videoAuthToken', function(data) {
            console.log("Received video authorization token: "+data.token);
            VideoContainer.updateGoogleHangoutButton(data.token, data.url);
        });
        socket.emit('generateVideoAuthToken', login.canoURL);
    },
    
    setVideoEmbedTag : function (html) {
        var socket = mysocket.s[0];
        socket.emit('setVideoEmbedTag', {name: login.canoURL, html: html});
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
            // embed code textfield:
            $('<div class="option"></div>').append(
                $('<label for="embedHTML"></label>').text(VideoAddon.strings.option_embedHTML_label),
                $('<input id="embedHTML" type="text" />'),
                $('<input type="button" value="&gt;" />').click(VideoContainer.setOption_embedHTML)
            ),
            
            // Google+ Hangout button:
            $('<div class="option"></div>').append(
                $('<a class="hangout-button" href="https://plus.google.com/hangouts/_" target="_blank" style="text-decoration:none;"></a>').append(
                    $('<img src="https://ssl.gstatic.com/s2/oz/images/stars/hangout/1/gplus-hangout-24x100-normal.png"\
                            alt="Start a Hangout"\
                            style="border:0;width:100px;height:24px;"/>')
                ).css({opacity: 0.5})
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
    
    updateEmbedCodeInput : function (html) {
        var $options = VideoContainer.$container.find('> .options');
        $options.find('#embedHTML').val(html);
    },
    
    updateGoogleHangoutButton : function (token, url) {
        var server = mysocket.NodeServer[0],
            $options = VideoContainer.$container.find('> .options');
        
        $options.find('a.hangout-button')
            .attr('href', 'https://plus.google.com/hangouts/_?gid=60297079067&gd='+server+url+'?token='+token+'&liveid=')
            .animate({opacity: 1});
    },
    
    setOption_embedHTML : function () {
        var html = VideoContainer.$container.find('#embedHTML').val();
        VideoAddon.setVideoEmbedTag(html);
    }
};

setTimeout(function() {
    VideoAddon.init();
    VideoContainer.init();
}, 500);

