/* 
 *  This file is part of KeyNode.JS.
 * 
 *  KeyNode.JS is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  KeyNode.JS is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with KeyNode.JS.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */
var SlideChooserAddon = {
    $slideChooser : null,
    $setup : $.keynode('getSetup'),
    lang : {
        de : {
            slidePreviewTitle: "Folie $1"
        },
        en : {
            slidePreviewTitle: "Slide $1"
        }
    },
    
    init : function () {
        // do not do anything before presenter.slideLength is available:
        if(presenter.slideLength < 0) {
            setTimeout(SlideChooserAddon.init, 500);
            return;
        }
        
        // init strings:
        if (navigator.language.indexOf("de") > -1) {
            SlideChooserAddon.strings = SlideChooserAddon.lang.de;
        } else {
            SlideChooserAddon.strings = SlideChooserAddon.lang.en;
        }
        var strings = SlideChooserAddon.strings;
        
        
        var $slideChooser = SlideChooserAddon.$slideChooser = $('<div id="SlideChooser"></div>');
        var $broad = $('<div class="broad"></div>');
        $(document.body).append( $slideChooser.append($broad) );
        
        
        var slideChooserMinOpacity = 0.5,
            iframeContainerMinOpacity = 0.7;
        
        $slideChooser
        .css({opacity: slideChooserMinOpacity})
        .mouseenter(function() { $slideChooser.stop().animate({opacity: 1}, 200); })
        .mouseleave(function() { $slideChooser.stop().animate({opacity: slideChooserMinOpacity}, 300); });
        
        
        for(var slideNo=0; slideNo<presenter.slideLength; slideNo++) {
            if(SlideChooserAddon.$setup===null)
                SlideChooserAddon.$setup=$.keynode('getSetup');
            var $iframe    = $('<iframe />').attr('src', SlideChooserAddon.$setup.getPresentationURL()+'#slidechooser-slide-'+slideNo);
            var $blocker   = $('<div class="click-blocker"></div>');
            var $container = $('<div class="slide-container"></div>');
            $broad.append( $container.append($iframe, $blocker) );
            
            $container
            .css({opacity: iframeContainerMinOpacity});
            $blocker
            .mouseenter(function() { $(this).parent().stop().animate({opacity: 1}, 200); })
            .mouseleave(function() { $(this).parent().stop().animate({opacity: iframeContainerMinOpacity}, 300); });
            
            $blocker[0].slideNo = slideNo;
            $blocker.attr('title', strings.slidePreviewTitle.replace(/\$1/, slideNo+1));
            $blocker.click(function(evt) {
                SlideChooserAddon.slideClick(evt, this.slideNo);
            });
        }
        
        var containerWidth = $container.width(),
            containerMargin= parseInt( $container.css('margin-right').replace(/px/, '') ),
            borderWidth    = parseInt( $container.css('border-left-width').replace(/px/, '') )
                           + parseInt( $container.css('border-right-width').replace(/px/, '') );
        $broad.css({
            width: ( (containerWidth+containerMargin+borderWidth)*presenter.slideLength + 5 ) + 'px'
        });
    },
    
    slideClick : function (event, slideNo) {
        console.log("slideClick: "+slideNo);
        event.preventDefault();
        
        var prevSlideNo = presenter.slideNumber;
        presenter.slideNumber = slideNo;
        presenter.GotoFolie(slideNo);
        
        var e = $.Event($.keynode('getEvents').presenter.slideChange);
        $(document).trigger(e, [prevSlideNo, slideNo]);
    }
};

setTimeout(function() {
    SlideChooserAddon.init();
}, 1500);

