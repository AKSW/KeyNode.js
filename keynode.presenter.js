var presenter = {
	slideNumber : 0,
	slideLength:-1,
	ShowNext : function () {
		if ($(KeyNode.options.selectors.slide_container).css('left') === '0px') {
			$(KeyNode.options.selectors.slide_container).stop().animate({
				'left' : '-1024px'
			}, 200);
		} else if ($(KeyNode.options.selectors.slide_container).css('left') === '1024px') {
		//	$('#slide_container').stop().animate({
		//		'left' : '0'
		//	}, 200);
		}
	},
	ShowLast : function () {
		if ($(KeyNode.options.selectors.slide_container).css('left') === '-1024px') {
			$(KeyNode.options.selectors.slide_container).stop().animate({
				'left' : '0px'
			}, 200);
		} else if ($(KeyNode.options.selectors.slide_container).css('left') === '0px') {
		//	$('#slide_container').stop().animate({
		//		'left' : '1024px'
		//	}, 200);
		}
	},
	Next : function () {
		if ((presenter.slideLength!=-1)&&(presenter.slideNumber < presenter.slideLength)) {
			presenter.slideNumber += 1;
			presenter.GotoFolie(presenter.slideNumber);
                        var e = $.Event($.keynode('getEvents').change);
                        $(document).trigger(e,[presenter.slideNumber-1,presenter.slideNumber]);
			}
	},
	Prev : function () {
		if (presenter.slideNumber > 0) {
			presenter.slideNumber -= 1;
			presenter.GotoFolie(presenter.slideNumber);
                        var e = $.Event($.keynode('getEvents').change);
                        $(document).trigger(e,[presenter.slideNumber+1,presenter.slideNumber]);
		}
	},
	BindKeys : function () {
            
            $(document).keydown(function (e) {
                options=$.keynode('getOptions');
                if (e.which === options.keys.next 
                    || $.inArray(e.which, options.keys.next) > -1) {
                        presenter.Next();
                        e.preventDefault();
                }
                else if (e.which === options.keys.previous 
                    || $.inArray(e.which, options.keys.previous) > -1) {
                        presenter.Prev();
                        e.preventDefault();
                }
                else if (e.which === options.keys.gotoRight 
                    || $.inArray(e.which, options.keys.gotoRight) > -1) {
                        presenter.ShowNext();
                        e.preventDefault();
                }
                else if (e.which === options.keys.gotoLeft 
                    || $.inArray(e.which, options.keys.gotoLeft) > -1) {
                        presenter.ShowLast();
                        e.preventDefault();
                }
            });
	
            //@TODO: var time not time out
            setTimeout(function(){
            document.getElementById(KeyNode.options.selectors.after_frame.substr(1))
                .contentWindow
                .postMessage('setDiff:1',$(KeyNode.options.selectors.after_frame).attr('src'));
            document.getElementById(KeyNode.options.selectors.current_frame.substr(1))
                .contentWindow
                .postMessage("getNumberSlides:a",$(KeyNode.options.selectors.current_frame).attr('src'));

            },3000);

            $(KeyNode.options.selectors.click_blocker).css({
                    'height' : '100%',
                    'z-index' : '10'
            });
	},
	initIframe : function () {
		if (!$(KeyNode.options.selectors.current_container)[0]) {
			setTimeout(presenter.initIframe, 500);
		} else {
			$(KeyNode.options.selectors.current_container)
                            .append('<iframe src="' + login.presURL + '" width="100%" height="100%" id="'
                                +KeyNode.options.selectors.current_frame.substr(1)
                                +'" style="z-Index:0;border:none;"></iframe> ');
			$(KeyNode.options.selectors.current_container)
                            .append('<div class="'
                                +KeyNode.options.selectors.click_blocker.substr(1)
                                +'"> </div>');
			$(KeyNode.options.selectors.after_container)
                            .append('<iframe src="' + login.presURL + '" width="100%" height="100%" id="'
                             +KeyNode.options.selectors.after_frame.substr(1)
                            +'" style="z-Index:0;border:none;"></iframe> ');
			$(KeyNode.options.selectors.after_container)
                            .append('<div class="'
                                +KeyNode.options.selectors.click_blocker.substr(1)
                                +'"> </div>');
			presenter.BindKeys();
		}
	},
	initPresenterConsole : function () {
		$('body').find('*').hide();
		KeyNode.loadTmpl('presenter');
		presenter.initIframe();
	},
	GotoFolie : function (folie) {
		var data = {
			name : login.canoURL,
			folie : folie
		},
			i = null;
		for (i in mysocket.s) {
			if (typeof mysocket.s[i] !== 'undefined') {
				mysocket.s[i].emit('controlSync', data);
			}
		}
	}
};
presenter.initPresenterConsole();


var PresenterUI = {
    /**
     *  The bar at the edge of the screen where the video tab is.
     */
    MultiBar : {
        $MultiBar : null,
        barItems : [],
        init : function () {
            var MultiBar = PresenterUI.MultiBar;
            var $MultiBar = MultiBar.$MultiBar = $('<div id="multibar"></div>');
            $(document.body).append($MultiBar);
        },
        
        /**
         *  Add a PresenterUI.Tab or arbitrary other element to the MultiBar
         *  @param element
         *      What to add
         *  @param positionId
         *      Integer id indicating the position where the element should be inserted.
         *      Smaller positionIds will be placed left of greater positionIds.
         */
        add : function (element, positionId) {
            if((element instanceof Array) || (element instanceof jQuery)) {
                for(var i=0; i<element.length; i++) {
                    PresenterUI.MultiBar.add(element[i], positionId);
                }
                return;
            } else if(element instanceof PresenterUI.Tab) {
                element.attachedToMultiBar = PresenterUI.MultiBar;
                element = element.getContainer();
            }
            
            if(positionId) {
                var barItems = PresenterUI.MultiBar.barItems;
                for(var i=0; i<barItems.length; i++) {
                    if(barItems[i].positionId > positionId) {
                        $(element).insertBefore(barItems[i].element);
                        var item = {
                            positionId: positionId,
                            element: element
                        };
                        PresenterUI.MultiBar.barItems = barItems.slice(0, i);
                        PresenterUI.MultiBar.barItems.push(item);
                        PresenterUI.MultiBar.barItems = PresenterUI.MultiBar.barItems.concat(barItems.slice(i));
                        return;
                    }
                }
            }
            
            // if no positionId is given or we reached the end of barItems, just add it to the end:
            PresenterUI.MultiBar.barItems.push({
                positionId: positionId,
                element: element
            });
            PresenterUI.MultiBar.$MultiBar.append(element);
        },
        
        remove : function (element) {
            if((element instanceof Array) || (element instanceof jQuery)) {
                for(var i=0; i<element.length; i++) {
                    PresenterUI.MultiBar.remove(element[i]);
                }
                return;
            } else if(element instanceof PresenterUI.Tab) {
                element.attachedToMultiBar = false;
                element = element.getContainer();
            }
            var barItems = PresenterUI.MultiBar.barItems;
            for(var i=0; i<barItems.length; i++) {
                if(barItems[i] == element) {
                    PresenterUI.MultiBar.barItems = barItems.splice(i,1);
                    $(element).detach();
                    return true;
                }
            }
            return false;
        }
    }
};

PresenterUI.MultiBar.init();


PresenterUI.Tab = function (title, id) {
    var that = this;
    this.title = title;
    this.slideState = false;
    this.attachedToMultiBar = false;
    
    this.$container = $('<div class="multibar-tab"></div>');
    if(id)
        this.$container.attr('id', id);
    
    this.$container.append(
        this.$h2      = $('<h2></h2>').text(title),
        this.$content = $('<div class="content"></div>')
    );
    
    this.$content.hide();
    this.$h2.click(function() { that.slideToggle(); });
};

PresenterUI.Tab.prototype = {
    /** Returns the wrapping <div> DOM element */
    getContainer : function () {
        return this.$container[0];
    },
    /** Returns the `div.content` DOM child element */
    getContent : function () {
        return this.$content[0];
    },
    /** Event handler that is triggered by clicking on the tab title */
    slideToggle : function () {
        var that = this,
            h2MinOpacity = 0.3;
        
        if(!this.slideState) {
            // Content is not visible:
            this.$content.stop().slideDown(400);
            this.$h2.animate({opacity: h2MinOpacity}, 400);
            this.$h2.mouseenter(function() {
                that.$h2.stop().animate({opacity: 1}, 200);
            });
            this.$h2.mouseleave(function() {
                that.$h2.stop().animate({opacity: h2MinOpacity}, 200);
            });
            this.slideState = true;
            
        } else {
            
            // Content is visible:
            this.$content.stop().slideUp(400);
            this.$h2.animate({opacity: 1}, 400);
            this.$h2.unbind('mouseenter').unbind('mouseleave');
            this.slideState = false;
        }
    }
};

