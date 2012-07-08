
var login = {
	timer : null,
	timerTest : function () {
		if (login.timer !== null) {
			clearTimeout(login.timer);
		}
		return true;
	},
	bindTooltips : function () {
		$(".tooltipEnable").tooltip({
			position : "center left",
			offset : [-2, -25],
			effect : "fade",
			events : {
				def : "mouseenter mouseover,mouseleave mouseout",
				input : "mouseover, mouseout",
				widget : "mouseenter mouseover,mouseleave mouseout"
			},
			opacity : 0.7
		});
	},
	init : function () {
		KeyNode.loadCSS('login');
		var contentData = {
			'title' : 'KeyNode.JS – Presenter'
		};
		KeyNode.loadTmpl('login', contentData);
		login.bindCanoUrl();
	},
	bindCanoUrl : function () {
		if (!$(KeyNode.options.selectors.cano_container)[0] && login.timerTest()) {
			login.timer = setTimeout(login.bindCanoUrl, 100);
		} else {
			login.bindTooltips();
			$(KeyNode.options.selectors.cano_submit)
                            .unbind('click')
                            .click(login.testCanoURL);
			$(KeyNode.options.selectors.cano_input)
                            .unbind('keydown')
                            .keydown(function (e) {
				if (e.keyCode === 13) {
					login.testCanoURL();
				}
			});
		}
	},
	timertest:null,
	handleSettingsReceive : function(str){
	if(timertest!=null) { 
			clearTimeout(timertest);
			timertest=null;
		}
	var myObject = JSON.parse(str);
	//$('#presentationURLinput').attr('value',myObject.canonical);
	login.addNodeServer(myObject.server);
	login.showMore();
		},
	showMore : function(){
		$('#temper').remove();
		$(KeyNode.options.selectors.login_start_btn)
                    .unbind('click')
                    .click(login.submitToServer)
                    .fadeIn('slow');
		/*show  NodeServerURL things*/
		$(KeyNode.options.selectors.node_container)
                    .find(KeyNode.options.selectors.node_input)
                    .unbind('keydown')
                    .keydown(function (e) {
			if (e.keyCode === 13) {
				var path = $(this).val();
				login.addNodeServer(path);
			}
                    })
                    .parent()
                    .find(KeyNode.options.selectors.node_submit)
                    .unbind('click')
                    .click(function () {
			var path = $(this).parent().find(KeyNode.options.selectors.node_input).val();
			login.addNodeServer(path);
                    })
                    .parent()
                    .fadeIn('slow');
                    
		/*show  presentationURL things*/
		$(KeyNode.options.selectors.pres_url)
                    .fadeIn('slow');
		login.finishWorking();
	},
	receivePostMessage : function (event) {
		if (event.data.indexOf('getDiff') !=-1) {
			event.source.postMessage("getDiff:"+diff,event.origin);
		} else 
		if (event.data.indexOf('setDiff') !=-1) {
			temp=event.data.substring(event.data.indexOf(':')+1);
			diff=temp;
			//event.source.postMessage('setDiff:true',event.origin);
		} else
		if (event.data.indexOf('getSettings') !=-1) {
			temp=event.data.substring(event.data.indexOf(':')+1);
			login.handleSettingsReceive(temp);
		} else
		if (event.data.indexOf('getNumberSlides') !=-1) {
			temp=parseInt(event.data.substring(event.data.indexOf(':')+1));
			presenter.slideLength=(temp-1);
		} 

	},
	failGetSettings : function () {
            $(KeyNode.options.selectors.error_class)
                .remove();
            $(KeyNode.options.selectors.pres_url_input)
                .before('<div class="'+KeyNode.options.selectors.error_class.substr(1)+'">'+KeyNode.options.strings.error_no_load_from_cano+'</div>')
            $(KeyNode.options.selectors.pres_url)
                .find(KeyNode.options.selectors.pres_url_mybutton)
                .fadeIn('fast')
                .unbind('click')
                .click(function () {
                    login.testAltURL();
                });
            login.showMore();
            login.finishWorking();
	},
	testCanoURL : function () {
		login.startWorking();
		login.nodeServer = [];
		$(KeyNode.options.selectors.node_saved).hide();
		$(KeyNode.options.selectors.node_container+' '+KeyNode.options.selectors.node_url_input).show();
		$(KeyNode.options.selectors.node_container+' '+KeyNode.options.selectors.node_mybutton).show();
		var cano = $(KeyNode.options.selectors.cano_input);
		//new IFRAME Methods
		$('body').append('<iframe id="temper" style="display:none;"></iframe>');
		$('#temper').attr('src',cano.val());
		setTimeout(function(){document.getElementById('temper').contentWindow.postMessage("getSettings:",cano.val());},2000);
		timertest=setTimeout(login.failGetSettings,2500);
		window.addEventListener("message", login.receivePostMessage, false);
	},
	testAltURL : function () {
		var alt = $(KeyNode.options.selectors.pres_url_input);
		login.startWorking();
		login.nodeServer = [];
		$(KeyNode.options.selectors.node_saved).hide();
		$(KeyNode.options.selectors.node_container+" "+KeyNode.options.selectors.node_url_input)
                    .show();

		//new IFRAME Methods
		$('body').append('<iframe id="temper" style="display:none;"></iframe>');
		$('#temper').attr('src',alt.val());
		setTimeout(function(){document.getElementById('temper').contentWindow.postMessage("getSettings:",alt.val());},2000);
		if(timertest!=null) { 
			clearTimeout(timertest);
			timertest=null;
		}
		timertest=setTimeout(login.failGetSettings,2500);
		window.addEventListener("message", login.receivePostMessage, false);

	},
	submitToServer : function () {
		login.startWorking();
		if ($(KeyNode.options.selectors.node_input).val() !== '') {
			login.addNodeServer($(KeyNode.options.selectors.node_input).val());
		}
		if (login.nodeServer.length === 0) {
			alert(KeyNode.options.strings.error_one_at_least);
			login.finishWorking();
		}
		$(KeyNode.options.selectors.cano_input).attr('disabled', 'disabled');
		$(KeyNode.options.selectors.cano_submit).fadeOut('fast');
		login.canoURL = $(KeyNode.options.selectors.cano_input).val();
		login.presURL = $(KeyNode.options.selectors.pres_url_input).val() !== '' ? 
                    $(KeyNode.options.selectors.pres_url_input).val() :
                    $(KeyNode.options.selectors.cano_input).val();
                    
		//mache server[] bekannt
		mysocket.setValues(login.nodeServer);
		//test4 serversocketIO
		mysocket.getSocketIO(function () {
			//set 4 admin --> ident@all servers mysocket.ident
			mysocket.connect2Server(function () {});
			login.finishWorking();
		});
	},
	startWorking : function () {
		var bg = $(KeyNode.options.selectors.loading_bg),
			load = $(KeyNode.options.selectors.loading_container);
		if (bg[0] && load[0]) {
			bg.fadeIn('fast');
			load.fadeIn('fast');
		}
	},
	finishWorking : function () {
		var bg = $(KeyNode.options.selectors.loading_bg),
			load = $(KeyNode.options.selectors.loading_container);
		if (bg[0] && load[0]) {
			bg.fadeOut('fast');
			load.fadeOut('fast');
		}
	},
	addNodeServer : function (path) {
		if (path !== '') {
			login.nodeServer[login.nodeServer.length] = path;
			$('body>'+KeyNode.options.selectors.node_saved)
                            .clone()
                            .appendTo(KeyNode.options.selectors.node_container)
                            .find(KeyNode.options.selectors.node_server_input)
                            .html(path)
                            .parent()
                            .find(KeyNode.options.selectors.node_remove_btn)
                            .unbind('click')
                            .click(login.removeNodeServer)
                            .parent()
                            .fadeIn('slow')
                            .find(KeyNode.options.selectors.node_pw_container)
                            .fadeIn('fast')
                            .unbind('keydown')
                            .keydown(function (e) {
				if (e.keyCode === 13) {
					login.submitToServer();
				}
			});
			login.bindTooltips();
		} else {
			alert(KeyNode.options.strings.node_not_empty);
		}
	},
	removeNodeServer : function () {
		$(this).parent().fadeOut('fast');
		var t = $(this).parent().find(KeyNode.options.selectors.node_server_input).html(),
			k = null;
		for (k in login.nodeServer) {
			if (login.nodeServer[k] === t) {
				login.nodeServer.splice(k, 1);
				break;
			}
		}
	},
	nodeServer : [],
	canoURL : null,
	presURL : null,
	serverPass : null
};
login.init();
