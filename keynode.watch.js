var diff = 0;

var myTimer = null,
    strings=null,
    currSlide=0;
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
                        
                        console.log(strings.get_it_success);
                        $.deck('watcher.bindSocketEvents');
                        return true;
                }
        },
        getSocketIO : function () {
                console.log(strings.get_it_from_server);
                if (mysocket.serverTrys <= 0) {
                        return false;
                } else {
                        if (NodeServer.charAt(NodeServer.length - 1) === '/') {NodeServer = NodeServer.substring(0, (NodeServer.length - 1));}
                        mysocket.serverTrys -= 1;
                        $.ajax({
                                url : NodeServer + '/socket.io/socket.io.js',
                                dataType : "script",
                                success : mysocket.mySuccess
                        });
                }
        }
},
/**
 *  Strings in different languages
 *
 *
 **/
lang={
    de:{
        get_it_from_server:'Socket.IO nicht gefunden. (Versuche Socket.IO von einem Server zu beziehen)',
        get_it_success:'Socket.io vom Server erfolgreich geladen. Breche weitere Versuche ab.',
        connected_to:'Verbindung aufgebaut, zu:',/*serverURL added after*/
        presenter_online:'Präsentator online',
        presenter_offline:'Präsentator offline',
        presenter_push_slide:'Gehe zu Folie: ',/* new slideNUmber added after*/
        disconnected:'Verbindung verlohren',
        connecting:'Verbindungsaufbau',
        retry_in:'Erneuter Verbindungsversuch in ',/* time added after */
    },
    eng:{
        get_it_from_server:'Socket.IO not found(try to get it from Server).',
        get_it_success:'Retry cancelled.(Socket.io loaded)',
        connected_to:'Connection established to:',/*serverURL added after*/
        presenter_online:'Presenter online',
        presenter_offline:'Presenter offline',
        presenter_push_slide:'Goto: ',/* new slideNumber added after*/
        disconnected:'Lost connection',
        connecting:'try 2 connect',
        retry_in:'Retry in ',/* time added after */
    }
    
};


var LastTry = 5;
(function($, deck, undefined) {
	var $d = $(document);
    
    var hash = document.location.href.split('#')[1];
    if(hash && hash.match(/^slidechooser-slide-([0-9]+)/)) {
        var slideNo = parseInt(RegExp.$1);
        // This document is just a slidechooser slide preview:
        $d.bind('deck.init', function() {
            $[deck]('go', slideNo);
        });
        return;     // stop initialization
    }
    
    
    $.extend(true, $[deck].defaults, {
		classes: {
			
		},
		
		selectors: {
			
		},
		
		keys: {
		    
		},
		
        events : {
            /*
            Event fired whenever a new slidenumber is recived.
            */
            watcherChange: 'watcher.GoToSlide',
            /*
            Event fired before the Init of the login
            */
            beforeInitialize: 'watcher.beforeInit',
            /*
            Event fired when the presenter is started
            */
            initialize: 'watcher.init',
            /*
            Event fired after the PostMessages are bind
            */
            bindPostMessages: 'watcher.bindPostMessages',
            
            bindSocketEvents: 'watcher.bindSocketEvents',

            receivePostMessage: 'watcher.receivePostMessage',

            setOnline: 'watcher.setOnline',

            setPresented: 'watcher.setPresented',

            setOffline: 'watcher.setOffline'
        }
	});
    $[deck]('extend', 'watcher.receivePostMessage',function(event) {
        $d.trigger($[deck]('getOptions').events.receivePostMessage);
        if (event.data.indexOf('getDiff') !== -1) {
                event.source.postMessage("getDiff:" + diff, event.origin);
        } else if (event.data.indexOf('getNumberSlides') !== -1) {
                event.source.postMessage('getNumberSlides:'+$.deck('getSlides').length, event.origin);
        } else if (event.data.indexOf('setDiff') !== -1) {
                temp = event.data.substring(event.data.indexOf(':')+1);
                diff = parseInt(temp);
                if((diff!==-1) && (diff!==1)) alert(temp);

                //event.source.postMessage('setDiff:true', event.origin);
        } else if (event.data.indexOf('getSettings') !== -1) {
                event.source.postMessage('getSettings:{"canonical":"' + CanonicalURL + '","server":"' + NodeServer + '","mail":"' + Mail + '"}', event.origin);			
        } 

    });       
    $[deck]('extend', 'watcher.bindPostMessages', function() {
        $d.trigger($[deck]('getOptions').events.bindPostMessages);
        window.addEventListener("message", function(data){$[deck]('watcher.receivePostMessage',data)}, false);    
	}); 
    $[deck]('extend', 'watcher.bindSocketEvents', function() {
        $d.trigger($[deck]('getOptions').events.bindSocketEvents);
        if (mysocket.getSocket() === null) {
                console.log(strings.retry_in,LastTry + ' sec');
                myTimer = setTimeout(function(){
                    $[deck]('watcher.bindSocketEvents')
                }, LastTry * 1000);
                
                LastTry = LastTry * 2;
                return;
        }
        console.log(strings.connecting); 
        
        mysocket.getSocket().removeAllListeners('connect').on('connect', function () {
                mysocket.getSocket().emit('ConnectToPres', CanonicalURL);
                
                mysocket.getSocket().removeAllListeners('Ready').on('Ready', function () {
                    
                    $d.trigger($[deck]('getOptions').events.setOnline);
                    console.log(strings.connected_to,  NodeServer);
                });
                
                mysocket.getSocket().removeAllListeners('presenterOnline').on('presenterOnline', function () {
                    $d.trigger($[deck]('getOptions').events.setPresented);
                    console.log(strings.presenter_online );
                });
                mysocket.getSocket().removeAllListeners('presenterOffline').on('presenterOffline', function () {
                    $d.trigger($[deck]('getOptions').events.setOffline);
                    console.log(strings.presenter_offline );
                });
                mysocket.getSocket().removeAllListeners('GoTo').on('GoTo', function (data) {
                    $[deck]('go', (data + diff));
                    currSlide = (data + diff);
                    $d.trigger($[deck]('getOptions').events.watcherChange, data);
                    console.log(strings.presenter_push_slide, data);
                });
                mysocket.getSocket().removeAllListeners('disconnect').on('disconnect', function () {
                    $d.trigger($[deck]('getOptions').events.setOffline);
                    console.log(strings.disconnected );
                });
        });
        
	}); 
    $[deck]('extend', 'watcher.init', function() {
        /*
        * LanguageSelect 
        */
        if (navigator.language.indexOf("de") > -1) {
            strings=lang.de;
        }else{
            strings=lang.eng;
        }
       // presState.init();
        if ((CanonicalURL === null) && (!$("link[rel='http://ns.aksw.org/keynode/canonical']")[0])) {
                setTimeout($[deck]('watcher.init'), 200);
        } else {
                if ((NodeServer === null) && (!$("link[rel='http://ns.aksw.org/keynode/server']")[0])) {
                        setTimeout(function(){$[deck]('watcher.init')}, 200);
                } else {
                        $[deck]('watcher.bindSocketEvents');
                        $[deck]('watcher.bindPostMessages');
                }
        }
	}); 

    $[deck]('extend', 'watcher.getLastSlide', function() {
        return currSlide;
    });
    
    $d.bind('deck.init', function() {
        $d.trigger($[deck]('getOptions').events.beforeInitialize);
        $[deck]('watcher.init');
        $d.trigger($[deck]('getOptions').events.initialize);
    })
})(jQuery, 'deck');

