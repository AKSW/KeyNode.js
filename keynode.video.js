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
        var socket = $.keynode('getSocketHandler');
        var setup = $.keynode('getSetup');
        // init strings:
        if (navigator.language.indexOf("de") > -1) {
            VideoAddon.strings = VideoAddon.lang.de;
        } else {
            VideoAddon.strings = VideoAddon.lang.en;
        }
        socket.bind('videoEmbedTag', function(html) {
            VideoContainer.updateEmbedCodeInput(html);
        });
        
        socket.bind('videoAuthToken', function(data) {
            console.log("Received video authorization token: "+data.token);
            VideoContainer.updateGoogleHangoutButton(data.token, data.url);
        });
        socket.broadcast('generateVideoAuthToken', setup.getCanonicalURL());
    },
    
    setVideoEmbedTag : function (html) {
        var setup = $.keynode('getSetup');
        var socket = $.keynode('getSocketHandler');
        socket.broadcast('setVideoEmbedTag', {name: setup.getCanonicalURL(), html: html});
    }
};

var VideoContainer = {
    videoOptionsTab : null,
    slideState : false,
    
    init : function () {
        var tab = VideoContainer.videoOptionsTab
            = new PresenterUI.Tab(VideoAddon.strings.containerTitle, 'video-options-tab');
        var $options = $( tab.getContent() );
        
        PresenterUI.MultiBar.add(tab, 20);
        
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
    
    updateEmbedCodeInput : function (html) {
        var $options = $(VideoContainer.videoOptionsTab.getContent());
        $options.find('#embedHTML').val(html);
    },
    
    updateGoogleHangoutButton : function (token, url) {
        var setup = $.keynode('getSetup');
        var i=0;
        while(typeof setup.getNodeServer(i)!==typeof undefined){
            i++;
            
        }
        var server = setup.getNodeServer(0).url.replace(/^[a-z]+:\/\//, ''),
            $options = $(VideoContainer.videoOptionsTab.getContent());
        
        var gd = encodeURIComponent(server+url+'?token='+token+'&liveid=');
        $options.find('a.hangout-button')
            .attr('href', 'https://plus.google.com/hangouts/_?gid=60297079067&gd='+gd)
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

