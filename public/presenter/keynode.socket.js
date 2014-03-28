/**
 * 
 * Socket Stuff
 * 
 * @version 0.1.0
 * @author Alrik Hausdorf <admin@morulia.de>
 * 
 */
var SocketHandler = window.SocketHandler || {};

var SocketHandler = function(){
    
    var $events=$.keynode('getEvents');
    
    var $setup=$.keynode('getSetup');
    
    var $serverSocketIO=null;
    
    var timeRetryGetSocketIO = 5000;
    
    
    var servers=null;
    /**
     * tests for socketIO
     * @returns {Boolean} true/false if socket io is there
     */
    function hasSocketIO () {
        return (typeof (io) === typeof(undefined)) ? false : true;
    };
    function connectServers () {
        var nodes=$setup.getNodeServers();
        for (var server in nodes){
            nodes[server].socket=io.connect(nodes[server].url);
            bindEvents(nodes[server]);
        }
       
    };
    var listener = {
        connect : function(server){
            server.state=1;
            console.log(server.url," -- Connect");              
            $(document).trigger($events.nodeServer.connected,server);
            //ident for Pres
            server.socket.emit('ConnectToPres', $setup.getCanonicalURL());
        },
        disconnect : function(server){
            server.state=0;
            console.log(server.url," -- Disconnect");
            $(document).trigger($events.nodeServer.diconnected,server);
        },
        ready : function(server) {
            console.log(server.url," -- Ready");
            $(document).trigger($events.nodeServer.ready,server);
            server.socket.emit('SetAdmin', {
					"admin" : server.password,
					"name" : $setup.getCanonicalURL()
				});
           // server.socket.emit('identAsAdmin', $setup.getCanonicalURL());
        },        
        ident : function(server,data) {
            console.log(server.url," -- ident: ",data);
            var eventData={
                "server":server,
                "data":data
            };
            $(document).trigger($events.nodeServer.ident,eventData);
        },        
        goto : function(server,data) {
            console.log(server.url," -- goto",data);
            
            $.keynode('setSlideNumber',data);
            try{
                presenter.slideNumber=data;
            }catch(e){}
        },        
        passwordReset : function(server,data) { 
            var eventData={
                "server" : server,
                "data" : data
            };
            console.log(server.url," -- passwordReset");
            $(document).trigger($events.nodeServer.passReset,eventData);
        }
    };
    function bindEvents (server1) {
        var server=server1;
        console.log(server.url," -- BINDING");
        $(document).trigger($events.nodeServer.binding,server);
        server.socket
            .removeAllListeners('connect')
            .on('connect', function(){
                listener.connect(server);
            })
            .removeAllListeners('Ready')
            .on('Ready', function(){
                listener.ready(server);
            })
            .removeAllListeners('GoTo')
            .on('GoTo', function(data){
                listener.goto(server,data);
            })
            .removeAllListeners('disconnect')
            .on('disconnect', function(){
                listener.disconnect(server);
            })
            .removeAllListeners('identAsAdmin')
            .on('identAsAdmin', function (data) {
                    listener.ident(server,data);
                    
            })
            .removeAllListeners('resetedPassword')
            .on('resetedPassword', function (data) {
                    listener.passwordReset(server,data);
                    
            });
        
    };
    /**
     * try to get Socket IO from one of the Servers
     * @param {function|undefined} i wich iterator step
     * @param {function|undefined} callback function called at success
     * @returns void
     */
     function getSocketIO (callback,i) {
            if(typeof (callback) === typeof(undefined)) callback=function(){};
            if(typeof (i) === typeof(undefined)) i=0;
            if(servers === null){ 
                servers=[];
                nodes=$setup.getNodeServers();
                for (server in nodes){
                    servers[servers.length]=nodes[server];
                }
            }
            $.ajax({
                timeout: 500,
                url : servers[i].url + '/socket.io/socket.io.js',
                dataType : "script"
            }).done(function() {
                $serverSocketIO= servers[i];
                $(document).trigger($events.setup.advancedform.socketIOReady,servers[i]);
                callback();
            }).fail(function(){
                $(document).trigger($events.setup.advancedform.socketIOError,servers[i]);
                i=i+1;
                if(typeof (servers[i]) === typeof(undefined)) {
                    window.setTimeout(function(){
                        getSocketIO(callback,0);
                    },timeRetryGetSocketIO);
                    
                }else{
                  getSocketIO(callback,i);  
                }
            });
        };
    /**
     * Init SocketHandler
     * 
     */
    function init(){
        if(!hasSocketIO()) return getSocketIO(init);
        connectServers();
        
    };
    delete window.io; 
    init();
    return {
       reinit : function(){
            delete window.io; 
            servers = null;
            init();
       },
       reIdentServer : function (url) {
           var nodes=$setup.getNodeServers();
           for (ele in nodes) 
               if(nodes[ele].url===url){
                   var server= nodes[ele];
                   
               }
           
           server.socket.emit('SetAdmin', {
               "admin" : server.password,
               "name" : $setup.getCanonicalURL()
           });
       },
       broadcast : function (message,data){
            var nodes=$setup.getNodeServers();
            for (var server in nodes){
                nodes[server].socket.emit(message,data);
            }
       },
       bind : function (message,func){
            var nodes=$setup.getNodeServers();
            for (var server in nodes){
                nodes[server].socket.removeAllListeners(message).on(message,func);
            }
       }
    };
};


/*var mysocket = {
	messageTimeOut : null,
	NodeServer : null,
	socket : null,
	myTimer : null,
	s : null,
	LastTry : 2,
	test4SocketIO : function () {
		return (typeof (io) === typeof(undefined)) ? false : true;
	},
	mySuccess : function (callback) {
		//alert('ready');
		if (mysocket.myTimer === null) {
			return true;
		} else {
			window.clearTimeout(mysocket.myTimer);
			console.log(KeyNode.options.strings.retry_canceled);
			callback();
			return true;
		}
	},
        
	connect2Server : function (callback) {
		if (mysocket.s === null) {
			mysocket.s = [];
		}
		$(KeyNode.options.selectors.node_container)
                    .find(KeyNode.options.selectors.node_input)
                    .hide('fast')
                    .parent()
                    .find(KeyNode.options.selectors.node_submit)
                    .hide('fast');
		$(KeyNode.options.selectors.node_container)
                    .find(KeyNode.options.selectors.node_saved)
                    .each(function () {
			if (!$(this).is(':visible')) {
				$(this).remove();
			}
		});
		$(KeyNode.options.selectors.node_container)
                    .find(KeyNode.options.selectors.node_remove)
                    .each(function () {
			$(this).remove();
                    });
		var i = null;
		for (i in mysocket.NodeServer) {
			if (typeof mysocket.NodeServer[i] !== 'undefined') {
				if (mysocket.test4SocketIO()) {
					console.log(KeyNode.options.strings.try_connect , mysocket.NodeServer[i]);
					mysocket.s[i] = io.connect(mysocket.NodeServer[i]);
					mysocket.bindSocketEvents(i);
				}
			}
		}
		callback();
	},
	oNidentAsAdmin : function (data, globThis) {
		if (data.ident === "ADMIN") {
			globThis.find(KeyNode.options.selectors.error_class).remove();
			globThis.css({'background-color' : 'rgba(0,255,0,0.3)'});
                        console.log(KeyNode.options.strings.ident_accepted , data.name);
		} else if (data.ident === "USER") {
			globThis.find(KeyNode.options.selectors.error_class)
                            .remove();
			globThis
                            .find(KeyNode.options.selectors.node_pw_reset_btn).show();
			globThis
                            .css({'background-color' : 'rgba(255,0,0,0.3)'})
                            .append('<div class="'
                                +KeyNode.options.selectors.error_class.substr(1)
                                +'">'+KeyNode.options.strings.error_pw_wrong+'</div>');
		}
		mysocket.test4ready();
	},
	startPresenter : function () {
		KeyNode.loadCSS('presenter');
		KeyNode.loadJS('keynode.presenter');
		KeyNode.loadCSS('slidechooser');
		KeyNode.loadJS('keynode.slidechooser');
		KeyNode.loadCSS('timer');
		KeyNode.loadJS('keynode.timer');
		KeyNode.loadCSS('video');
		KeyNode.loadJS('keynode.video');
	},
	readypres : null,
	test4ready : function () {
		var ready = 0,
			all = mysocket.readypres.length,
			i = null;
		for (i in mysocket.readypres) {
			if (mysocket.readypres[i] === 1) {
				ready += 1;
			}
		}
		if (ready > 0) { //mindestens 1mal ready
			if (ready === all) {
				$(KeyNode.options.selectors.login_retry_btn)
                                    .remove();
				$(KeyNode.options.selectors.login_start_btn)
                                    .css({'width' : '100%'})
                                    .unbind('click')
                                    .click(mysocket.startPresenter);
				$(KeyNode.options.selectors.login_start_btn)
                                    .attr('value', KeyNode.options.strings.start_pres);
			} else {
				if (!$(KeyNode.options.selectors.login_retry_btn)[0]) {
					$(KeyNode.options.selectors.login_start_btn)
                                        .after('<input id="'
                                            +KeyNode.options.selectors.login_retry_btn.substr(1)
                                            +'" type="button" value="'+KeyNode.options.strings.test_inputs+'" > ')
				} 
                                $(KeyNode.options.selectors.login_start_btn)
                                    .css({'width' : '50%'})
                                    .unbind('click')
                                    .click(mysocket.ident);
				
				$(KeyNode.options.selectors.login_start_btn)
                                    .css({'width' : '50%'})
                                    .unbind('click')
                                    .click(mysocket.startPresenter);
                                    
				$(KeyNode.options.selectors.login_start_btn)
                                    .attr('value', KeyNode.options.strings.start_pres);
			}
		} else { //kein server ready
			$(KeyNode.options.selectors.login_retry_btn)
                            .remove();
                        
			$(KeyNode.options.selectors.login_start_btn)
                            .css({'width' : '100%'})
                            .unbind('click')
                            .click(mysocket.ident);
                            
			$(KeyNode.options.selectors.login_start_btn)
                            .attr('value', KeyNode.options.strings.retest_inputs);
		}
		/* UNSECURE trigger socket.ident every time [enter] in one input
                 *$('body')
                    .find('#Password')
                    .unbind('keydown');
		$('.myPasswordInput')
                    .unbind('keydown')
                    .keydown(function (e) {
			if (e.keyCode === 13) {
				mysocket.ident();
			}
		});
	},
	ident : function () {
		$(KeyNode.options.selectors.node_container)
                    .find(KeyNode.options.selectors.node_saved)
                    .each(function () {
			var t = 0,
                        i = null,
                        //ident for one server
                        globThis = $(this),
                        pw = $(this)
                            .find(KeyNode.options.selectors.node_pw_input)
                            .val(),
                        server = $(this)
                            .find(KeyNode.options.selectors.node_server_input)
                            .html();
			$(this)
                            .find(KeyNode.options.selectors.node_pw_reset_btn)
                            .removeAttr('disabled')
                            .unbind('click')
                            .click(function () {
				mysocket.s[t].emit('resetPassword', {
					"name" : login.canoURL
				});
				var Message = "",
					bg = "rgba(255,0,0,0.5)";//rot
				mysocket.s[t].removeAllListeners('resetedPassword');
				mysocket.s[t].on('resetedPassword', function (data) {
					if (data.type === 'localReset') {
						Message = KeyNode.options.strings.socket_pw_reseted_console;
						bg = "rgba(0,255,0,0.5)";//grün
					} else {
						if (data.type === 'mailReset') {
                                                    	Message = KeyNode.options.strings.socket_pw_reseted_mail;
							bg = "rgba(0,255,0,0.5)";//grün
						} else {
							if (data.type === 'fail-noMail') {
								Message = KeyNode.options.strings.socket_pw_reset_fail_nomail;
								bg = "rgba(255,0,0,0.5)";//rot
							}
						}
					}
					if (Message !== "") {
						if ($("body>"+KeyNode.options.message.id)[0]) {
							clearTimeout(mysocket.messageTimeOut);
							$(KeyNode.options.message.id)
                                                            .css({'background': bg})
                                                            .html(Message)
                                                            .fadeIn('slow');
							mysocket.messageTimeOut = setTimeout(function () {
                                                            $(KeyNode.options.message.id)
                                                                .fadeOut('slow');
							}, KeyNode.options.message.timeout_time);
						} else {
							$("body")
                                                            .append('<div id="'+KeyNode.options.message.id.substr(1)+'" style="position:absolute; display:none; -border-radius:5px;-moz-border-radius:5px;-khtml-border-radius:5px; text-align:center; padding: 5px; left: 50%; width: 600px; top: 5px; margin-left:-300px;background:' + bg + '" > ' + Message + '</div>')
                                                            .find(KeyNode.options.message.id)
                                                            .fadeIn('slow');
							clearTimeout(mysocket.messageTimeOut);
							mysocket.messageTimeOut = setTimeout(function () {
								$(KeyNode.options.message.id)
                                                                    .fadeOut('slow');
							}, KeyNode.options.message.timeout_time);
						}
					}
				});
			});
			if (mysocket.test4SocketIO()) {
				for (i in mysocket.NodeServer) {
					if (mysocket.NodeServer[i] === server) {
						t = i;
					}
				}
				if (mysocket.readypres === null) {
					mysocket.readypres = [];
				}
				mysocket.readypres[t] = 0;
				mysocket.s[t].emit('SetAdmin', {
					"admin" : pw,
					"name" : login.canoURL
				});
				mysocket.s[t].removeAllListeners('identAsAdmin');
				mysocket.s[t].on('identAsAdmin', function (data) {
					if (data.ident === 'ADMIN') {
						mysocket.readypres[t] = 1;
					}
					mysocket.oNidentAsAdmin(data, globThis);
				});
			}
		});
		mysocket.test4ready();
	},
	oNReady : function (i) {
		console.log(KeyNode.options.strings.connected_server, mysocket.NodeServer[i] );
		$(KeyNode.options.selectors.node_container)
                    .find(KeyNode.options.selectors.node_remove_btn)
                    .parent()
                    .each(function () {
			if ($(this).find(KeyNode.options.selectors.node_server_input).html() === mysocket.NodeServer[i]) {
				$(this).css({'background-color' : 'rgba(255,255,0,0.3)'});
			}
		});
		mysocket.ident();
	},
	oNconnect : function (i) {
		mysocket.s[i].emit('ConnectToPres', login.canoURL);
		mysocket.s[i].removeAllListeners('Ready');
		mysocket.s[i].on('Ready', mysocket.oNReady(i));
	},
	bindSocketEvents : function (i) {
		mysocket.s[i].removeAllListeners('connect');
		mysocket.s[i].on('connect', mysocket.oNconnect(i));
		mysocket.s[i].removeAllListeners('reconnect');
		mysocket.s[i].on('reconnect', function () {
			console.log('REConnected to ' + mysocket.NodeServer[i] + '.');
			mysocket.bindSocketEvents(i);
		});
	},
	getSocketIO : function (i, callback) {
		if ((typeof i === 'undefinded')) {
			callback = function () {};
			i = 0;
		}
		if ((typeof i === 'function')) {
			callback = i;
			i = 0;
		}

                if (!mysocket.test4SocketIO()) {
                    $.getScript((mysocket.NodeServer[i] + '/socket.io/socket.io.js'))
                        .done(function () {
                            callback();
                        }).fail(function(){
                            i += 1;
                            if (i < mysocket.NodeServer.length) {
                                mysocket.getSocketIO(i, callback);
                            } else {
                                console.log(KeyNode.options.strings.retry_in, mysocket.LastTry + ' sec');
                                mysocket.myTimer = window.setTimeout(function () {
                                    mysocket.getSocketIO(0, callback);
                                }, mysocket.LastTry * 1000);
                                mysocket.LastTry = mysocket.LastTry * 2;
                            }
                        });
                }
	},
	setValues : function (server) {
		mysocket.NodeServer = server;
	}
};*/