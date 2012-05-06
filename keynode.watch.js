var diff = 0;
(function ($, deck, undefined) {
	var myTimer = null,
		CanonicalURL = $("link[rel='http://ns.aksw.org/keynode/canonical']")[0] ? $("link[rel='http://ns.aksw.org/keynode/canonical']").attr("href") : null,
		NodeServer = $("link[rel='http://ns.aksw.org/keynode/server']")[0] ? $("link[rel='http://ns.aksw.org/keynode/server']").attr("href") : null,
		Mail = $("link[rel='http://ns.aksw.org/keynode/mailto']")[0] ? $("link[rel='http://ns.aksw.org/keynode/mailto']").attr("href") : null,
		/**
		 * Socket for the communication with the server
		 *
		 */
		mysocket = {
			socket : null,
			serverTrys : 1,
			test4SocketIO : function () {
				return (typeof (io) === 'undefined') ? false : true;
			},
			getSocket : function () {
				mysocket.serverTrys = 1;
				if (mysocket.socket === null) {
					if (mysocket.test4SocketIO()) {
						mysocket.socket = io.connect(NodeServer);
						return mysocket.socket;
					}
					return !mysocket.getSocketIO() ? null : mysocket.getSocket();
				} else {
					return mysocket.socket;
				}
			},
			mySuccess : function () {
				if (myTimer === null) {
					return true;
				} else {
					clearTimeout(myTimer);
					console.log('Retry canceled.(Socket.io loaded)');
					bindSocketEvents();
					return true;
				}
			},
			getSocketIO : function () {
				console.log('Socket.IO not found(try to get it from Server).');
				if (mysocket.serverTrys <= 0) {
					return false;
				} else {
					if (NodeServer.charAt(NodeServer.length - 1) === '/') {NodeServer = NodeServer.substring(0, (NodeServer.length - 1)); }
					mysocket.serverTrys -= 1;
					$.ajax({
						url : NodeServer + '/socket.io/socket.io.js',
						dataType : "script",
						success : mysocket.mySuccess
					});
				}
			}
		},
		LastTry = 5;
	function init() {
		if ((CanonicalURL === null) && (!$("link[rel='http://ns.aksw.org/keynode/canonical']")[0])) {
			setTimeout(init, 200);
		} else {
			if ((NodeServer === null) && (!$("link[rel='http://ns.aksw.org/keynode/server']")[0])) {
				setTimeout(init, 200);
			} else {
				bindSocketEvents();
			}
		}
	}
	/**
	 *	Bind the Socketevents
	 *	at fail set Timeout to try it again
	 *
	 */
	function bindSocketEvents() {
		if (mysocket.getSocket() === null) {
			console.log('Retry in ' + LastTry + ' sec');
			myTimer = setTimeout(bindSocketEvents, LastTry * 1000);
			LastTry = LastTry * 2;
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
				$.deck('go', (data + diff));
			});
			mysocket.getSocket().on('Ready', function (data) {});
		});
	}
	function receivePostMessage(event) {
		switch (event.data) {
		case (event.data.indexof('getDiff:') !=-1):
			event.source.postMessage("getDiff:"+diff,event.origin);
			break;
		case (event.data.indexof('setDiff:') !=-1):
			temp=event.data.split(':',1);
			diff=temp[1];
			event.source.postMessage('setDiff:true',event.origin);
			break;
		case (event.data.indexof('getSettings:') !=-1):
			break;
/*		case 'showNotes':
			break;
		case 'hideNotes':
			break;
		case 'statusNotes':
			break;*/
		default: 
			break;
		}

	}
	/**
	 *	Bind the IframeMessageSystem
	 *
	 */
	function bindPostMessages() {
		window.addEventListener("message", receivePostMessage, false);
	}
	$(document).bind('deck.init', init);
})(jQuery, 'deck');