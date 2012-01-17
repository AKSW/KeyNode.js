/**
* admin.js
* MainObject
*
*/

Admin = function () 
{
	/**
	* NoteObject
	*
	*/
	/**@public */  this.notes;
	/**
	* TimerObject
	*
	*/
	/**@public */ this.timer;
	/**
	* Number of the Current Slide
	*
	*/
	/**@public */ this.slideNumber = 1;
	/**
	* Number of the Current ListDisplays
	*	(-1 if there are no)
	*/
	/**@public */ this.listNumber = -1;
	
	/** 
	* Number of the Last Slide
	*
	*/
	/**@public */ this.lastSlide;
	/**
	* Socket for the communication with the server
	*
	*/
	/**@public */ this.socket = new io.Socket(null, 
	{
			port : 4150,
			rememberTransport : false
		}
	);
	/**
	* init of the Class
	*
	*/
	this.init = function () 
	{
		this.socketinit();
		this.getSlides();
		this.notes = new Notes();
		this.notes.init();
		this.setHandler();
		this.time = new Timer();
		this.time.init();
		this.Resize_Handler();
	}
	/**
	* get the Slides from the server
	*
	*/
	this.getSlides = function () 
	{
		$.ajax(
		{
				type : "POST", 
				timeout : 2000, 
				url : './slidyData/index.html', 
				success : function (data) 
				{
					t1=String(data).split('<body>');
					t2=String(t1[1]).split('</bod>');
					t3=String(t2[0]).replace(/\.\//g,"./slidyData/");

					key.lastSlide = $('#slideData').html(t3).find('.slide').length;
				}
			}
		);
		
	}
	/**
	* jump to a special slide
	* @param {number} slide number of the target (slide)
	*
	*/
	this.goToSlide = function (slide) 
	{
		//console.log('goToSlide: ' + slide);
		this.slideNumber = slide;
		
		this.loadMainSlide();
		this.loadPrevSlide();
		this.loadNextSlide();
		this.notes.loadNotes();
		//this.changeCss();
		this.Resize_Handler();
		this.hideListElements();
		this.unhideUsedListElements();
		this.socketSend();
	}
	/**
	* hide all list elements
	*
	*/
	this.hideListElements = function () 
	{
		$('#slide_current').find('li').each(function(ele){
		$(this).css({'visibility':'hidden'});
		
		});
	}
	/**
	* unhide all list elements that should be displayed
	*
	*/
	this.unhideUsedListElements = function () 
	{
		i=0;
		$('#slide_current').find('li').each(function(){
		
		if(i<key.listNumber)$(this).css({'visibility':'visible'});
		i++;
		});
	}
	/**
	* reload the slide_current
	*
	*/
	this.loadMainSlide = function () 
	{
		$('#slide_current').find('*').fadeOut('fast').parent().html('');
		$('#slideData>.slide').eq(this.slideNumber - 1).clone().hide().appendTo('#slide_current').fadeIn('slow');
	}
	/**
	*	Send the current slide and the current listelement
	*
	*/
	this.socketSend=function()
	{
		this.socket.send((this.slideNumber - 1)+':'+this.listNumber);
		
	}
	/**
	* reload the slide_before
	*
	*/
	this.loadPrevSlide = function () 
	{
		$('#slide_before').find('*').fadeOut('fast').parent().html('');
		if (this.slideNumber - 2 >= 0) 
			$('#slideData>.slide').eq(this.slideNumber - 2).clone().hide().appendTo('#slide_before').fadeIn('slow');
	}
	
	/**
	* reload the slide_after
	*
	*/
	this.loadNextSlide = function () 
	{
		$('#slide_after').find('*').fadeOut('fast').parent().html('');
		$('#slideData>.slide').eq(this.slideNumber).clone().hide().appendTo('#slide_after').fadeIn('slow');
	}
	
	/**
	* manipulate the css
	*
	*/
	this.changeCss = function () 
	{
		/*if ($('#slide_current .slide').length) 
		{
			$('#slide_current .slide').css(
			{
					'font-size' : '100%'
				}
			);
		}
		if ($('#slide_current h1').length) 
		{
			$('#slide_current h1').css(
			{
					'background' : '#0077CC'
				}
			);
		}
		if ($('#slide_current .cover').length) 
		{
			$('#slide_current h1').css(
			{
					'background' : ''
				}
			);
		}
		if ($('#slide_current .bild-mit-titel').length) 
		{
			$('#slide_current img').css(
			{
					'height' : '50%'
				}
			);
		}
		
		if ($('#slide_before .slide').length) 
		{
			$('#slide_before .slide').css(
			{
					'font-size' : '45%'
				}
			);
		}
		if ($('#slide_before h1').length) 
		{
			$('#slide_before h1').css(
			{
					'background' : '#0077CC'
				}
			);
		}
		if ($('#slide_before .cover').length) 
		{
			$('#slide_before h1').css(
			{
					'background' : ''
				}
			);
		}
		if ($('#slide_before .bild-mit-titel').length) 
		{
			$('#slide_before img').css(
			{
					'height' : '25%'
				}
			);
		}
		
		if ($('#slide_after .slide').length) 
		{
			$('#slide_after .slide').css(
			{
					'font-size' : '45%'
				}
			);
		}
		if ($('#slide_after h1').length) 
		{
			$('#slide_after h1').css(
			{
					'background' : '#0077CC'
				}
			);
		}
		if ($('#slide_after .cover').length) 
		{
			$('#slide_after h1').css(
			{
					'background' : ''
				}
			);
		}
		if ($('#slide_after .bild-mit-titel').length) 
		{
			$('#slide_after img').css(
			{
					'height' : '25%'
				}
			);
		}*/
	}
	
	var was_small = false;
	/**
	* take the work of resizing the slides
	*
	*/
	this.Resize_Handler = function () 
	{

		//nur Größen anpassen, wenn Fenster wenigstens Größe 640x480 hat
		if (($(window).width() > 640) && ($(window).height() > 480)) {
			//errechnen, ob Breite oder Höhe als Maß genommen wird
			var wh_dif = $(window).height() / 768;
			if (($(window).width() / 1024) < ($(window).height() / 768)) 
			{
				wh_dif = $(window).width() / 1024;
			}
			wh_dif = Math.abs(wh_dif);
			
			//einzelne Werte berechnen
			var gap18 = Math.floor(18 * wh_dif);
			var gap19 = Math.floor(19 * wh_dif);
			var gap20 = Math.floor(20 * wh_dif);
			var timertextwidth = Math.floor(275 * wh_dif);	
			var slideCurrentWidth = Math.floor(620 * wh_dif);
			var slideContainerWidth = Math.floor(640 * wh_dif);
			var slideBefAftWidth = Math.floor(290 * wh_dif);
			var slideContainerHeight = Math.floor(480 * wh_dif);
			var slideCurrentHeight = Math.floor(460 * wh_dif);
			var slideBefAftHeight = Math.floor(213 * wh_dif);
			var pad10 = Math.floor(10 * wh_dif);
			var TimerHeight = Math.floor(50 * wh_dif); 
			var SlideContainerWidthPerc = Math.floor(slideCurrentWidth/8);
			var SlideContainerHeightPerc = Math.floor(slideCurrentHeight/8);
			var SlideBefAftWidthPerc = Math.floor(slideBefAftWidth/5);
			var SlideBefAftHeightPerc = Math.floor(slideBefAftHeight/5);
			
			//Werte für Objekte festelegen
			if ((wh_dif < 1.0) || (was_small)) {
				var NotesHeight = slideCurrentHeight + slideBefAftHeight + 4*pad10 - 10 - TimerHeight;
			} else {
				var NotesHeight = slideCurrentHeight + slideBefAftHeight + 4*pad10 - 10 - 50;
			}
			
		
			$("#slide_container").css(
			{
					"padding" : gap18 + "px",
					"padding-bottom" : gap19 + "px",
					"width" : slideContainerWidth + "px"
				}
			);
			
			$("#slide_current_cont").css(
			{
					"width" : slideCurrentWidth + "px",
					"height" : slideCurrentHeight + "px",
					"margin-bottom" : gap18 + "px",
					"padding" : pad10 + "px"
				}
			);
			
			$("#slide_before_cont").css(
			{
					"padding" : pad10 + "px",
					"width" : slideBefAftWidth + "px",
					"height" : slideBefAftHeight + "px"
				}
			);
			
			$("#slide_after_cont").css(
			{
					"padding" : pad10 + "px",
					"margin-left" : (slideCurrentWidth-(2*slideBefAftWidth)-(2*pad10))  + "px",
					"width" : slideBefAftWidth + "px",
					"margin-bottom" : gap20 + "px",
					"height" : slideBefAftHeight + "px"
				}
			);
			
			
			$("#slide_current").css(
			{
					"width" : slideCurrentWidth + "px",
					"height" : slideCurrentHeight + "px"
				}
			);
			
			$("#slide_before_title").css(
			{
					"width" : slideBefAftWidth + "px",
					"height" : slideBefAftHeight + "px",
				}
			);
			
			$("#slide_after_title").css(
			{
					"width" : slideBefAftWidth + "px",
					"height" : slideBefAftHeight + "px"
				}
			);
			
			$("#slide_before").css(
			{
					"width" : slideBefAftWidth + "px",
					"height" : slideBefAftHeight + "px"
				}
			);
			
			$("#slide_after").css(
			{
					"width" : slideBefAftWidth + "px",
					"height" : slideBefAftHeight + "px"
				}
			);
			
			$("#note_container").css(
			{
					"height" : NotesHeight + "px",
					"margin-bottom" : gap18 + "px"
				}
			);
			$("#stuff_container").css(
			{
					"padding-top" : gap18 + "px",
					"padding-bottom" : gap19 + "px",
					"padding-right" : gap18 + "px"
				}
			);

			if ((wh_dif < 1.0) || (was_small)) 
			{
				if (wh_dif >= 1.0) 
				{
					was_small = false;
					wh_dif = 1;
				} else 
					was_small = true;
				
				var picwidth = Math.floor(45 * wh_dif);
				var picheight = Math.floor(40 * wh_dif);
				var StuffContainerWidth = Math.floor(330 * wh_dif);
				TimerHeight = Math.floor(50 * wh_dif); 
				var timertextfont = Math.floor(40 * wh_dif);
				var gap5 = Math.floor(5 * wh_dif);
				$("#stuff_container").css(
				{
						"width" : StuffContainerWidth + "px"
					}
				);
				$("#note_container").css(
				{
						"width" : StuffContainerWidth + "px"
					}
				);

				$("#timer_container").css(
				{
						"height" : TimerHeight + "px",
						"width" : StuffContainerWidth + 10 + "px"
					}
				);
				
				$("#timer_control_pic").css(
				{
						"margin-left" : gap5 + "px",
						"margin-top" : gap5 + "px",
						"width" : picwidth + "px",
						"height" : picheight + "px"
					}
				);
				
				$("#timer_text").css(
				{
						"padding-left" : gap5 + "px",
						"padding-right" : pad10 + "px",
						"width" : StuffContainerWidth + 10 - gap5 - picwidth + "px",
						"height" : TimerHeight + "px",
						"font-size" : timertextfont + "px"
					}
				);
			}
			
			$("#center_container").css(
			{
					"width" : Math.floor(1024 * wh_dif) + "px",
					"margin-left" : Math.floor((1024 * wh_dif)/2*-1) + "px"
				}
			);

			
		
			//SLIDES anpassen
			
			if ($('#slide_current .slide').length) 
			{
				$('#slide_current .slide').css(
				{
						'font-size' : SlideContainerWidthPerc+'%'
					}
				);
			}
			if ($('#slide_current h1').length) 
			{
				$('#slide_current h1').css(
				{
						'background' : '#0077CC'
					}
				);
			}
			if ($('#slide_current .cover').length) 
			{
				$('#slide_current h1').css(
				{
						'background' : ''
					}
				);
			}
			
			$('#slide_current img').css(
				{
						'height' : SlideContainerHeightPerc+'%',
						'width' : SlideContainerWidthPerc+'%'
					}
				);
			
			if ($('#slide_current .bild-mit-titel').length) 
			{
				$('#slide_current img').css(
				{
						'height' : SlideContainerHeightPerc+'%',
						'width' : SlideContainerWidthPerc+'%'
					}
				);
			}
			
			if ($('#slide_before .slide').length) 
			{
				$('#slide_before .slide').css(
				{
						'font-size' : SlideBefAftWidthPerc-20+'%'
					}
				);
			}
			if ($('#slide_before h1').length) 
			{
				$('#slide_before h1').css(
				{
						'background' : '#0077CC'
					}
				);
			}
			if ($('#slide_before .cover').length) 
			{
				$('#slide_before h1').css(
				{
						'background' : ''
					}
				);
			}
			
			
			$('#slide_before img').css(
				{
						'height' : SlideBefAftHeightPerc+'%',
						'width' : SlideBefAftWidthPerc+'%'
					}
				);
			
			if ($('#slide_before .bild-mit-titel').length) 
			{
				$('#slide_before img').css(
				{
						'height' : SlideBefAftHeightPerc+'%',
						'width' : SlideBefAftWidthPerc+'%'
					}
				);
			}
			
			if ($('#slide_after .slide').length) 
			{
				$('#slide_after .slide').css(
				{
						'font-size' : SlideBefAftWidthPerc-20+'%'
					}
				);
			}
			if ($('#slide_after h1').length) 
			{
				$('#slide_after h1').css(
				{
						'background' : '#0077CC'
					}
				);
			}
			if ($('#slide_after .cover').length) 
			{
				$('#slide_after h1').css(
				{
						'background' : ''
					}
				);
			}
			
			$('#slide_after img').css(
				{
						'height' : SlideBefAftHeightPerc+'%',
						'width' : SlideBefAftWidthPerc+'%'
					}
				);
			
			if ($('#slide_after .bild-mit-titel').length) 
			{
				$('#slide_after img').css(
				{
						'height' : SlideBefAftHeightPerc+'%',
						'width' : SlideBefAftWidthPerc+'%'
					}
				);
			}
		}
	}
	
	/**
	* bind the handler to our functions
	*
	*/
	this.setHandler = function () 
	{
		$(document).keydown(key.key_down);
		$(window).resize(key.Resize_Handler);
		
	}
	
	/**
	* unbind the handler to our functions
	*
	*/
	this.unsetHandler = function () 
	{
		$(document).unbind('keydown');
		//$(window).unbind('resize');
		
	}
	/**
	* manage the keyevents
	*
	*/
	this.key_down = function (e) 
	{
		switch (e.which) {
		case 34: 
			key.PrevSlide();
			break; //Page Down
		case 37: 
			key.PrevSlide();
			break; //Left arrow
			
		case 33: 
			key.NextSlide();
			break; //Page Up
		case 32: 
			key.NextSlide();
			break; //space bar
		case 39: 
			key.NextSlide();
			break; //Right arrow
			
		case 36: 
			key.goToSlide(1);
			break; //Home
		case 35: 
			key.goToSlide(key.lastSlide);
			break; //End
			
		}
		
	}
	/**
	* Number ob listelemts marked as incremental
	*
	*/
	this.numberListItems = function () 
	{
		if($('#slide_current ul.incremental')[0])return(($('#slide_current ul.incremental').find('li')).length);
		else return 0;
	}
	/**
	* jump to the previous Listement
	*
	*/
	this.PrevListItem = function () 
	{	
	
		this.listNumber=this.listNumber-1;	
		this.socketSend();
		this.hideListElements();
		this.unhideUsedListElements();
	}
	/**
	* jump to the previous slide
	*
	*/
	this.PrevSlide = function () 
	{
		if ((this.slideNumber - 1) >= 0)
		{ 
			if( (this.numberListItems()!=0)&&(this.listNumber!=0))
			{
			this.PrevListItem();
			}
			else
			{
			this.goToSlide(this.slideNumber - 1);
			this.listNumber=this.numberListItems();
			this.unhideUsedListElements();
			}
		}
		
	}
	/**
	* jump to the next Listement
	*
	*/
	this.NextListItem = function () 
	{	
		
		this.listNumber=this.listNumber+1;
		this.socketSend();
		this.hideListElements();
		this.unhideUsedListElements();
	}
	/**
	* jump to the next slide
	*
	*/
	this.NextSlide = function () 
	{
		if ((this.slideNumber + 1) <= this.lastSlide) 
		{ 
			if( (this.numberListItems()!=0)&&((this.listNumber)!=this.numberListItems())){
			this.NextListItem();
			
			}
			else
			{
			this.goToSlide(this.slideNumber + 1);
			}
		}
		
		
		
	}
	/**
	* init socket for the comunication with the server
	*
	*/
	this.socketinit = function () 
	{
		this.socket.connect();
		this.socket.on('message', function (obj) 
		{
				//console.log(obj.page);
				key.goToSlide(obj.page);
				key.listNumber=obj.list;
				key.hideListElements();
				key.unhideUsedListElements();
			}
		);
		
		this.socket.on('connect', function () 
		{
				console.log("connected");
			}
		);
		this.socket.on('disconnect', function () 
		{
				console.log("disconnected");
			}
		);
		this.socket.on('reconnect', function () 
		{
				console.log("reconnect");
			}
		);
		this.socket.on('reconnecting', function (nextRetry) 
		{
				console.log('Attempting to re-connect to the server, next attempt in ' + nextRetry + 'ms');
			}
		);
		this.socket.on('reconnect_failed', function () 
		{
				console.log('Reconnected to server FAILED.')
			}
		);
	}
	
}
$(document).ready(function () {
		key = new Admin();
		key.init();
		
	});
 