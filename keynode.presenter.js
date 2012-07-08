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
