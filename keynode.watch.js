var diff = 0;

var myTimer = null,
strings=null,
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
                        bindSocketEvents();
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
 *  Stings in different languages
 *
 *
 **/
lang={
    de:{
        offline:'keine Verbindung',
        online:'Verbunden, warte auf Präsentator',
        presenting:'Präsentation wird gehalten',
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
        offline:'no connection to server',
        online:'connected, waiting for presenter',
        presenting:'presentation in process',
        get_it_from_server:'Socket.IO not found(try to get it from Server).',
        get_it_success:'Retry canceled.(Socket.io loaded)',
        connected_to:'Connection established to:',/*serverURL added after*/
        presenter_online:'Presenter online',
        presenter_offline:'Presenter offline',
        presenter_push_slide:'Goto: ',/* new slideNUmber added after*/
        disconnected:'Lost connection',
        connecting:'try 2 connect',
        retry_in:'Retry in ',/* time added after */
    }
    
},

/**
 *  Indicator for the state of presentation
 *
 *
 **/
presState ={
    elem:null,
    selectorID: 'presState',
    cssGradient:"   background: rgb(214,249,255);\
                    background: -moz-linear-gradient(top, rgba(214,249,255,1) 0%, rgba(158,232,250,1) 100%);\
                    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(214,249,255,1)), color-stop(100%,rgba(158,232,250,1)));\
                    background: -webkit-linear-gradient(top, rgba(214,249,255,1) 0%,rgba(158,232,250,1) 100%);\
                    background: -o-linear-gradient(top, rgba(214,249,255,1) 0%,rgba(158,232,250,1) 100%);\
                    background: -ms-linear-gradient(top, rgba(214,249,255,1) 0%,rgba(158,232,250,1) 100%);\
                    background: linear-gradient(to bottom, rgba(214,249,255,1) 0%,rgba(158,232,250,1) 100%);\
                    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#d6f9ff', endColorstr='#9ee8fa',GradientType=0 );",
    css:{
        'display':'none',
        'position':'fixed',
        'overflow':'hidden',
        'top':'0px',
        'right':'0px',
        '-webkit-border-bottom-left-radius': '7px',
        '-moz-border-radius-bottomleft': '7px',
        'border-bottom-left-radius': '7px',
    },
    content:{
       node:null,
       selectorID:'contentDiv', 
       CSS:{
            'display':'block',
            'font-size':'10pt',
            'overflow':'hidden',
            'height':'30px',
            'width':'100px',
            'margin':'5px',
            'float':'left',
            
        },
        setText:function(text){
            this.node.html(text);
        }
    },
    stateDiv:{ 
        node:null,
        selectorID:'stateDiv',
        /* red */
        gradOne:"background: rgb(169,3,41);\
                background: -moz-linear-gradient(top,  rgba(169,3,41,1) 0%, rgba(143,2,34,1) 44%, rgba(109,0,25,1) 100%);\
                background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(169,3,41,1)), color-stop(44%,rgba(143,2,34,1)), color-stop(100%,rgba(109,0,25,1)));\
                background: -webkit-linear-gradient(top,  rgba(169,3,41,1) 0%,rgba(143,2,34,1) 44%,rgba(109,0,25,1) 100%);\
                background: -o-linear-gradient(top,  rgba(169,3,41,1) 0%,rgba(143,2,34,1) 44%,rgba(109,0,25,1) 100%);\
                background: -ms-linear-gradient(top,  rgba(169,3,41,1) 0%,rgba(143,2,34,1) 44%,rgba(109,0,25,1) 100%);\
                background: linear-gradient(to bottom,  rgba(169,3,41,1) 0%,rgba(143,2,34,1) 44%,rgba(109,0,25,1) 100%);\
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#a90329', endColorstr='#6d0019',GradientType=0 );\
                ",
        /* yellow */
        gradTwo:"background: rgb(255,255,5);\
                background: -moz-linear-gradient(top,  rgba(255,255,5,1) 0%, rgba(232,209,4,1) 45%, rgba(239,227,59,1) 100%);\
                background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(255,255,5,1)), color-stop(45%,rgba(232,209,4,1)), color-stop(100%,rgba(239,227,59,1)));\
                background: -webkit-linear-gradient(top,  rgba(255,255,5,1) 0%,rgba(232,209,4,1) 45%,rgba(239,227,59,1) 100%);\
                background: -o-linear-gradient(top,  rgba(255,255,5,1) 0%,rgba(232,209,4,1) 45%,rgba(239,227,59,1) 100%);\
                background: -ms-linear-gradient(top,  rgba(255,255,5,1) 0%,rgba(232,209,4,1) 45%,rgba(239,227,59,1) 100%);\
                background: linear-gradient(to bottom,  rgba(255,255,5,1) 0%,rgba(232,209,4,1) 45%,rgba(239,227,59,1) 100%);\
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffff05', endColorstr='#efe33b',GradientType=0 );\
                ",
        /* green */
        gradThree:"background: rgb(180,227,145);\
                background: -moz-linear-gradient(top,  rgba(180,227,145,1) 0%, rgba(97,196,25,1) 50%, rgba(180,227,145,1) 100%);\
                background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(180,227,145,1)), color-stop(50%,rgba(97,196,25,1)), color-stop(100%,rgba(180,227,145,1)));\
                background: -webkit-linear-gradient(top,  rgba(180,227,145,1) 0%,rgba(97,196,25,1) 50%,rgba(180,227,145,1) 100%);\
                background: -o-linear-gradient(top,  rgba(180,227,145,1) 0%,rgba(97,196,25,1) 50%,rgba(180,227,145,1) 100%);\
                background: -ms-linear-gradient(top,  rgba(180,227,145,1) 0%,rgba(97,196,25,1) 50%,rgba(180,227,145,1) 100%);\
                background: linear-gradient(to bottom,  rgba(180,227,145,1) 0%,rgba(97,196,25,1) 50%,rgba(180,227,145,1) 100%);\
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b4e391', endColorstr='#b4e391',GradientType=0 );\
                ",
        CSS:{
            'display':'block',
            'height':'30px',
            'width': '30px',
            'margin':'5px',
            'float':'left',
            '-webkit-border-radius': '8px',
            '-moz-border-radius': '8px',
            'border-radius': '8px',
        },
        
    },
    setOffline:function(){
        this.stateDiv.node.attr('style',this.stateDiv.gradOne).css(this.stateDiv.CSS);//red
        this.content.setText(strings.offline);
    },
    setOnline:function(){
        this.stateDiv.node.attr('style',this.stateDiv.gradTwo).css(this.stateDiv.CSS);//red
        this.content.setText(strings.online);
    },
    setPresented:function(){
        this.stateDiv.node.attr('style',this.stateDiv.gradThree).css(this.stateDiv.CSS);//red
        this.content.setText(strings.presenting);
    },
    showCSS:{
        'height':'40px',
        'width':'150px',
    },
    hideCSS:{
        'height':'0px',
        'width':'0px',
    },
    init: function(){
        if (this.elem===null){
            $('body')
                .append('<div id="'+this.selectorID+'" style="'+this.cssGradient+'"></div>')
                .find('#'+this.selectorID)
                .css(this.css)
                .append('<div id="'+this.stateDiv.selectorID+'"></div>')
                .find('#'+this.stateDiv.selectorID)
                .css(this.stateDiv.CSS)
                .parent()
                .append('<div id="'+this.content.selectorID+'">TestContent</div>')
                .find('#'+this.content.selectorID)
                .css(this.content.CSS);
            this.elem=$('#'+this.selectorID);
            this.stateDiv.node=$('#'+this.stateDiv.selectorID);
            this.content.node=$('#'+this.content.selectorID);
            this.show();
            this.setOffline();
            
        }
            
                

    },
    show: function(){
        this.elem.show().animate(this.showCSS,200);
        
    },
    hide: function(){
        this.elem.show().animate(this.hideCSS,200);
    }
}
LastTry = 5;
function init() {
        /*
        * LanguageSelect 
        */
        if (navigator.language.indexOf("de") > -1) {
            strings=lang.de;
        }else{
            strings=lang.eng;
        }
        presState.init();
        if ((CanonicalURL === null) && (!$("link[rel='http://ns.aksw.org/keynode/canonical']")[0])) {
                setTimeout(init, 200);
        } else {
                if ((NodeServer === null) && (!$("link[rel='http://ns.aksw.org/keynode/server']")[0])) {
                        setTimeout(init, 200);
                } else {
                        bindSocketEvents();
                        bindPostMessages();
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
                console.log(strings.retry_in,LastTry + ' sec');
                myTimer = setTimeout(bindSocketEvents, LastTry * 1000);
                LastTry = LastTry * 2;
                return;
        }
        console.log(strings.connecting); 
        
        mysocket.getSocket().removeAllListeners('connect').on('connect', function () {
                mysocket.getSocket().emit('ConnectToPres', CanonicalURL);
                
                mysocket.getSocket().removeAllListeners('Ready').on('Ready', function () {
                    presState.setOnline();
                    console.log(strings.connected_to,  NodeServer);
                });
                
                mysocket.getSocket().removeAllListeners('presenterOnline').on('presenterOnline', function () {
                    presState.setPresented()();
                    console.log(strings.presenter_online );
                });
                mysocket.getSocket().removeAllListeners('presenterOffline').on('presenterOffline', function () {
                    presState.setOnline();
                    console.log(strings.presenter_offline );
                });
                mysocket.getSocket().removeAllListeners('GoTo').on('GoTo', function (data) {
                        $.deck('go', (data + diff));
                        console.log(strings.presenter_push_slide,data );
                });
                mysocket.getSocket().removeAllListeners('disconnect').on('disconnect', function () {
                    presState.setOffline();
                    console.log(strings.disconnected );
                });
        });
}
function receivePostMessage(event) {
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
/*		case 'showNotes':
                break;
        case 'hideNotes':
                break;
        case 'statusNotes':
                break;*/



}
/**
    *	Bind the IframeMessageSystem
    *
    */
function bindPostMessages() {
        window.addEventListener("message", receivePostMessage, false);
        
}

$(document).bind('deck.init', init);