
var KeyNode = {
	init : function () {
            KeyNode.options=$.keynode('getOptions');
            KeyNode.loadCSS('parent');
            KeyNode.loadJS('keynode.login');
                
	},
	loadCSS : function (path) {
		$('head').append('<link rel="stylesheet" href="' + './Template/' + KeyNode.options.template.src + '/' + path + '.css" />');
		//$.getScript(path);
	},
	loadTmpl : function (path, filldata) {
		$.get('./Template/' + KeyNode.options.template.src + '/' + path + '.tpl', function (data) {
			$('body').append(data);
			var k = null;
			for (k in filldata) {
				if (typeof filldata[k] !== 'undefined') {
					$('body').find('#' + k).html(filldata[k]);
				}
			}
		}, 'html');
	},
	loadJS : function (path) {
		$.getScript('./' + path + '.js');
	},
        options:{}
};

var mysocket = {
	messageTimeOut : null,
	NodeServer : null,
	socket : null,
	myTimer : null,
	s : null,
	LastTry : 2,
	test4SocketIO : function () {
		return (typeof (io) === 'undefined') ? false : true;
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
		});*/
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
			$.getScript((mysocket.NodeServer[i] + '/socket.io/socket.io.js'), function (data, textStatus, jqxhr) {
				if (((jqxhr.status >= 200) && (jqxhr.status < 300)) || (jqxhr.status === 304)) {
					callback();
				} else {
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
				}
			});
		}
	},
	setValues : function (server) {
		mysocket.NodeServer = server;
	}
};
(function($, keynode, document, undefined) {
    var $d = $(document),
    options = {},
    events = {
		/*
                Event fired whenever a new slidenumber is broadcasted.
                 */
		change: 'keynode.change',
		
		/*
		Event fired before the Init of the login
		*/
		beforeInitialize: 'keynode.beforeInit',
		
		/*
		Event fired when the presenter is started
		*/
		initialize: 'keynode.init',
                
                /*
		Event fired after the Canonical URL is entered and submitted
		*/
		canonicalSend: 'keynode.canonicalSend',
                
                /*
		Event fired after a new Nodeserver is added to the list
		*/
		newNodeServer: 'keynode.newNodeServer',
                
                /*
		Event fired after a Nodeserver was removed from the list
		*/
		delNodeServer: 'keynode.delNodeServer'
                
	},
    methods = {
        init:function(opts){
            $d.trigger(events.beforeInitialize);

            options = $.extend(true, {}, $[keynode].defaults, opts);
           
            KeyNode.init();
            $d.trigger(events.initialize);
            
        },
        getOptions:function(){
            return options;
        },
        getEvents:function(){
            return events;
        }
    }
    /* jQuery extension */
    $[keynode] = function(method, arg) {
            if (methods[method]) {
                    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            }
            else {
                    return methods.init(arg);
            }
    };
    
    
    
    $[keynode].defaults = {
                template: {
                    src : 'default',
                },
		selectors: {
                    
                    /* global Stuff */
                    loading_bg:         '#LoadingBG',
                    loading_container:  '#LoadingContainer',
                    
                    /* canonical selectors */
                    cano_container:     '#CanonicalURL',
                    cano_submit:        '#CanonicalURLsubmit',
                    cano_input:         '#CanonicalURLinput',
                    
                    /* pres URL */
                    pres_url:           '#presentationURL',
                    pres_url_input:     '#presentationURLinput',
                    pres_url_mybutton:  '.myButton',
                    
                    /* Node selectors */
                    node_container:     '#NodeServerURL',
                    node_input:         '#NodeURLinput',
                    node_submit:        '#NodeURLsubmit',
                    node_saved:         '#NodeServerURLsaved',
                    node_remove:        '#NodeServerURLsavedRemove',
                    node_pw_reset_btn:  '.myResetButton',
                    node_url_input:     '.myURLInput',
                    node_remove_btn:    '.myRemButton',
                    node_mybutton:      '.myButton',
                    node_pw_input:      '#Passwordinput',
                    node_pw_container:  '#Password',
                    node_server_input:  '#serverValue',
                    
                    /* buttons */
                    login_start_btn:    '#presenterStartButton',
                    login_retry_btn:    '#presenterStartButton2',
                    
                    error_class:        '.errorMessage',
                    /* presenter tpl */
                    slide_container:    '#slide_container',
                    current_container:  '#slide_current',
                    current_frame:      '#CurrentFrame',
                    after_container:    '#slide_after',
                    after_frame:        '#AfterFrame',
                    click_blocker:      '.clickBlocker',
                    
                    

		},
		message:{
                    id: '#message',
                    timeout_time: 2000,
                },
		strings: {
                    retry_canceled:     'Retry canceled.(Socket.io loaded)',
                    try_connect:        'try 2 connect to: ',/* serverURl added after */
                    ident_accepted:     'U r admin of: ',/* CanoURL added after */
                    connected_server:   'Connected to servernumber: ',/* servernumber added after */
                    error_pw_wrong:     'Password wrong?',
                    retry_in:           'Retry in ' ,/*seconds and 'sec' added after*/
                    error_no_load_from_cano : 'Can not load your presentation from the canonical url.',
                    error_one_at_least: 'Please add at least one Nodeserver.',
                    
                    socket_pw_reseted_console:  'The password was reset. Please look in the console of the server.',
                    socket_pw_reseted_mail: 'The new Password was send to your mail address.',
                    socket_pw_reset_fail_nomail: 'No Mailadress found.',
                    
                    
                    start_pres:     'start presenter',
                    test_inputs:    'test inputs',
                    retest_inputs:  'retest inputs',
                    node_not_empty: 'please add something like http://server.de:port ',
		},
		
		keys: {
			// enter, space, page down,  down arrow,
			next: [13, 32, 34,  40],
			// backspace, page up,  up arrow
			previous: [8, 33, 38],
                        // right arrow,
                        gotoRight:[39],
                        // left arrow,
                        gotoLeft:[37]
		},
		
	};
    
})(jQuery, 'keynode', document);


$(document).bind('keynode.beforeInit', function(event) {
   console.log('beforeInit erfolgreich...');
});

$(document).bind('keynode.change', function(event,from,to) {
   console.log('keynode.change:',from,'-->',to);
});

$(document).bind('keynode.init', function(event) {
   console.log('init erfolgreich...');
});

$(document).bind('keynode.canonicalSend', function(event) {
   console.log('canonicalSend erfolgreich...');
});

$(document).bind('keynode.newNodeServer', function(event) {
   console.log('newNodeServer erfolgreich...');
});

$(document).bind('keynode.delNodeServer', function(event) {
   console.log('delNodeServer erfolgreich...');
});

