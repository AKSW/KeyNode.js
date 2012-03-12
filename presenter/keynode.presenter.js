var presenter = {
	slideNumber : 0,
	ShowNext : function () {
		//if($.deck('getSlides').length-1!=presenter.slideNumber) presenter.Last();
		if ($('#slide_container').css('left') === '0px') {
			$('#slide_container').stop().animate({
				'left' : '-1024px'
			}, 200);
		} else if ($('#slide_container').css('left') === '1024px') {
			$('#slide_container').stop().animate({
				'left' : '0'
			}, 200);
		}
	},
	ShowLast : function () {
		//if(presenter.slideNumber!=0)	presenter.Next();
		if ($('#slide_container').css('left') === '-1024px') {
			$('#slide_container').stop().animate({
				'left' : '0px'
			}, 200);
		} else if ($('#slide_container').css('left') === '0px') {
			$('#slide_container').stop().animate({
				'left' : '1024px'
			}, 200);
		}
	},
	Next : function () {
		presenter.slideNumber += 1;
		presenter.GotoFolie(presenter.slideNumber);
	},
	Prev : function () {
		if (presenter.slideNumber > 0) {
			presenter.slideNumber -= 1;
			presenter.GotoFolie(presenter.slideNumber);
		}
	},
	BindKeys : function () {
		$(document).keydown(function (e) {
			switch (e.keyCode) {
				//new By ME
			case 39:
				presenter.ShowNext();
				e.preventDefault();
				break; //right arrow
			case 37:
				presenter.ShowLast();
				e.preventDefault();
				break; //left arrow
			case 13:
				presenter.Next();
				e.preventDefault();
				break; //enter
			case 34:
				presenter.Next();
				e.preventDefault();
				break; //page down
			case 32:
				presenter.Next();
				e.preventDefault();
				break; //space
			case 40:
				presenter.Next();
				e.preventDefault();
				break; //down arrow
			case 8:
				presenter.Prev();
				e.preventDefault();
				break; //backspace
			case 33:
				presenter.Prev();
				e.preventDefault();
				break; //page up
			case 38:
				presenter.Prev();
				e.preventDefault();
				break; //up arrow
			default:
				return;
			}
			document.getElementById('BeforeFrame').contentWindow.diff = -1;
			document.getElementById('AfterFrame').contentWindow.diff = 1;
		});
		$('.clickBlocker').css({
			'height' : '100%',
			'z-index' : '10'
		});
	},
	initIframe : function () {
		if (!$('#slide_current')[0]) {
			setTimeout(presenter.initIframe, 500);
			//console.log('timeout1');
		} else {
			//console.log('fertgi' + login.presURL);
			$('#slide_current').append('<iframe src="' + login.presURL + '" width="100%" height="100%" id="CurrentFrame" style="z-Index:0;border:none;"></iframe> ');
			$('#slide_current').append('<div class="clickBlocker"> </div>');
			$('#slide_before').append('<iframe src="' + login.presURL + '" width="100%" height="100%" id="BeforeFrame" style="z-Index:0;border:none;"></iframe> ');
			$('#slide_before').append('<div class="clickBlocker"> </div>');
			$('#slide_after').append('<iframe src="' + login.presURL + '" width="100%" height="100%" id="AfterFrame" style="z-Index:0;border:none;"></iframe> ');
			$('#slide_after').append('<div class="clickBlocker"> </div>');
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
