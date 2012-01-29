
var presenter = {
	/**
	 * Socket for the communication with the server
	 *
	 */
	socket : null,
	slideNumber:0,
	
	PresentationString : $("meta[name='X-KeyNodeToken']").attr("value"),
	ConnectString : $("meta[name='X-KeyNodeListenServer']").attr("value"),
	AdminKey : $("meta[name='X-AdminKeyNodeToken']").attr("value"),
	NeededFolder : $("meta[name='X-KeyNodeNeededFolder']").attr("value"),
	/**
	 *
	 * Init the Socket
	 *
	 **/
	initServerSocket : function () {
		presenter.socket = io.connect(presenter.ConnectString);
	},
	ShowNext : function () {
		if($.deck('getSlides').length-1!=presenter.slideNumber)$.deck('prev');
	},
	ShowLast : function () {
		if(presenter.slideNumber!=0)	$.deck('next');
	},
	BindKeys:function(){
	$(document).keydown(function(e){

		switch(e.keyCode ){
		//new By ME
		case 39:presenter.ShowNext();e.preventDefault();break;
		case 37:presenter.ShowLast();e.preventDefault();break;
		default:return;
		}
	
	
	})
	//Bind Event ob changing the slide	
		$(document).bind('deck.change', function(event, from, to) {presenter.slideNumber=to;presenter.GotoFolie(to);});
		
		$('.clickBlocker').css({
			'height':'100%',
			
			'z-index':'10'
		})
	},
	getPresFromURL:function(){
	console.log('lade');
	$('body').append('<div id="temper"></div>');
	$.get(presenter.PresentationString,function(data){
	$('#temper').html(data)
			$('body').find('#slideData').html('<div class="'+$('#temper').find('body').attr('class')+'">'+$('#temper').find('body').html()+'</div>')//.parent().find('#temper').remove();
			
			});
	
	},
	initIframe : function () {
$('#slide_current').append('<iframe src="'+presenter.PresentationString+'" width="100%" height="100%" id="CurrentFrame" style="z-Index:0;border:none;"></iframe> ');
$('#slide_current').append('<div class="clickBlocker"> </div>');

$('#slide_before').append('<iframe src="'+presenter.PresentationString+'" width="100%" height="100%" id="BeforeFrame" style="z-Index:0;border:none;"></iframe> ');
$('#slide_before').append('<div class="clickBlocker"> </div>');

$('#slide_after').append('<iframe src="'+presenter.PresentationString+'" width="100%" height="100%" id="AfterFrame" style="z-Index:0;border:none;"></iframe> ');
$('#slide_after').append('<div class="clickBlocker"> </div>');
	
		this.BindKeys();
		
		
	},
	initPresenterConsole : function () {
	
		$('body').html(' ').attr('class','onlybody');
		$('.onlybody').css({'background':'url('+presenter.NeededFolder+'/images/BG.png)','text-align':'center'});
		$.get(presenter.NeededFolder+"/Presenter/presenter.css", function(css) {
			$("head").append("<style>"+css+"</style>");
		  });
		$.get(presenter.NeededFolder+'/Presenter/index.html',function(data){
			$('body.onlybody').append(data);
			//presenter.getPresFromURL();
			presenter.initIframe();
			});
			
		
		
		
	},
	GotoFolie : function (folie) {
	
		data = {
			name : presenter.PresentationString,
			folie : folie
		}
		presenter.socket.emit('controlSync', data);
		document.getElementById('BeforeFrame').contentWindow.watch.diff=-1;
		document.getElementById('AfterFrame').contentWindow.watch.diff=1;
	},
	/**
	 *
	 * tests, if the socket.IO is loaded
	 *
	 **/
	test4SocketIO : function () {}
}



$(document).ready(function(){presenter.initServerSocket();




presenter.socket.on('connect', function () {
	//TODO sortiere dich in Channel
	presenter.socket.emit('ConnectToPres', presenter.PresentationString);
	
	presenter.socket.on('Ready', function (data) {
		console.log('Connected to ' + presenter.ConnectString + '.');
		presenter.socket.emit('SetAdmin', {
			"admin" : presenter.AdminKey,
			"name" : presenter.PresentationString
		});
	});
	
	presenter.socket.on('identAsAdmin', function (data) {
		if (data.ident == "ADMIN") {
			//alert('Erfolgreich identifiziert als Admin! ;)');
			
			console.log('U R Admin of ' + data.name + '.');
			presenter.initPresenterConsole();
			//TODO: Init Konsole
			//TODO: broadcast Zustände
		}
		
	});
	
	
});








})
