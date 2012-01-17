
var watch = {
	/**
	 * Socket for the communication with the server
	 *
	 */
	socket : null,
	
	PresentationString : $("meta[name='X-KeyNodeToken']").attr("value"),
	ConnectString : $("meta[name='X-KeyNodeListenServer']").attr("value"),
	
	/**
	 *
	 * Init the Socket if meta was set
	 *
	 **/
	initServerSocket : function () {
		
		watch.socket = io.connect(watch.ConnectString);
	},
	
	/**
	 *
	 * tests, if the socket.IO is loaded
	 *
	 **/
	test4SocketIO : function () {}
}

watch.initServerSocket();

watch.socket.on('connect', function () {
	watch.socket.emit('ConnectToPres', watch.PresentationString);
	watch.socket.on('ready', function () {
		console.log('Connected to ' + watch.ConnectString + '.');
		
	});
	watch.socket.on('NewPresentation', function (data) {
		if (data == "Jenau")
			$('body')
			.append('<div class="KeynodeJSInform" ></div>')
			.find('.KeynodeJSInform')
			.html("Diese Presentation ist noch frisch und es wurde kein AdminCode hinterlegt.<br><button id='needAdminCode'>CodeAnfordern</button>")
			.css({
				"position" : "absolute",
				
				"top" : "50%",
				"background" : '#FF0000',
				
				"margin-top" : "-100px",
				"height" : "200px",
				"width" : "100%",
				
				"z-index" : "100000",
				"text-align" : "center"
			})
			.click(function () {
				watch.socket.emit('giveMeAnAdminKeyFor', watch.PresentationString)
				watch.socket.on('hereIsYourAdminKey', function (data) {
					$('#needAdminCode').unbind('click').replaceWith(
						'<hr> Du hast einen Code angefordert.'
						 + 'Nun füge der PresentationsConsole die folgende Metatinformation hinzu um als Admin der Präsentation anerkannt zu werden.'
						 + '<input style="text-align:center;width:100%;" type="text" value=\'' +
						'<meta name=\"X-AdminKeyNodeToken\" value=\"' + data + '\">\'>')
				})
			})
			
	});
});
