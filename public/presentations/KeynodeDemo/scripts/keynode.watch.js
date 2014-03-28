var diff=0;
(function($, deck, undefined) {
	var $d = $(document);
	var myTimer=null;

	/**
	 * Socket for the communication with the server
	 *
	 */
	var mysocket = {
		socket:null,
		serverTrys:1,
		test4SocketIO :function (){
			return (typeof(io)=='undefined')? false : true;
		},
		getSocket:function(){
			mysocket.serverTrys=1;
			if(CanonicalURL==null || NodeServer==null){ return false;}
			if(mysocket.socket==null){
				if(mysocket.test4SocketIO()) {mysocket.socket = io.connect(NodeServer); return mysocket.socket; }
				return !mysocket.getSocketIO()? null: mysocket.getSocket();
			}else return mysocket.socket;
		
		},
		mySuccess:function(){
		if (myTimer==null) return true;
		else {
			window.clearTimeout(myTimer);
			console.log('Retry canceled.(Socket.io loaded)');
			bindSocketEvents();
			return true;
		}
		
		},
		getSocketIO:function(){
			console.log('Socket.IO not found(try to get it from Server).');
			if(mysocket.serverTrys<=0) return false; else 
			{
			mysocket.serverTrys--;
			$.ajax({
			  url: NodeServer+'/socket.io/socket.io.js',
			  dataType: "script",
			  success: mysocket.mySuccess
			});
			}
		}
	
	};
	
	var LastTry=5;
	
	
	var CanonicalURL = $("link[rel='http://ns.aksw.org/keynode/canocical']")[0]?$("link[rel='http://ns.aksw.org/keynode/canocical']").attr("href"):null;
	var NodeServer = $("link[rel='http://ns.aksw.org/keynode/server']")[0]?$("link[rel='http://ns.aksw.org/keynode/server']").attr("href"):null;
	var Mail = $("link[rel='http://ns.aksw.org/keynode/mailto']")[0]?$("link[rel='http://ns.aksw.org/keynode/mailto']").attr("href"): null;
	/**
	*	Bind the Socketevents
	*	at fail set Timeout to try it again
	*
	*/
	function bindSocketEvents(){
		if(mysocket.getSocket()==null) {
		console.log('Retry in '+LastTry+' sec');
		myTimer=window.setTimeout(bindSocketEvents,LastTry*1000);
		LastTry=LastTry*2;
		return -1;
		}		
			console.log('try2connect');	
			mysocket.getSocket().on('connect', function () {
				console.log('connected');
				mysocket.getSocket().emit('ConnectToPres', CanonicalURL);
				mysocket.getSocket().on('ready', function () {
					console.log('Connected to ' + NodeServer + '.');
					
				});
				mysocket.getSocket().on('GoTo', function (data) {
					
					$.deck('go', (data+diff));
				});
				mysocket.getSocket().on('Ready', function (data) {
					
				});
			});
			
	
	
	}
	 $d.bind('deck.init', bindSocketEvents)
})(jQuery, 'deck');