
var login = {
    
    init : function () {
        KeyNode.loadCSS('login');
        KeyNode.loadTmpl('login');
        login.easyForm.bindSubmit();
    },
    helper:{
        urlCode : function(url){
            if(url.indexOf("http://")===-1)
                url="http://"+url;
            return url;
        },
        getLastSelected : function(){
            console.log("get");
            if (!login.helper.supportsHtml5Storage()) return "";
            if (!window['localStorage']) return "";
            var storage = window['localStorage'];
            var foo = storage.getItem("LastSelectedUrl");
            console.log("get:",foo);
            return foo;
        },
        setLastSelected : function(url){
            console.log("set",url);
            if (!login.helper.supportsHtml5Storage()) return false;
            if (!window['localStorage']) return false;
            var storage = window['localStorage'];
            storage.setItem("LastSelectedUrl",url);
            console.log("set:",url);
        },
        supportsHtml5Storage : function () {
            try {
              return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
              return false;
            }
        }
    },
    easyForm:{
        
        bindSubmit : function (){
            var $easyselectors=KeyNode.options.selectors.easy;
            if(!$($easyselectors.url)[0]){
                setTimeout(function(){
                    login.easyForm.bindSubmit() 
                 },100);
                 return;
            }
            $("body").delegate( $easyselectors.submit, "click", login.easyForm.submit );
            $("body").delegate( $easyselectors.url, "keydown", function(e){
                if (e.keyCode === 13) {
                    login.easyForm.submit();
                }
            });
            var value=login.helper.getLastSelected();
            var sel=$easyselectors.url;
            $(sel).val(value);
        
        },
        submit : function(){
            var $events=$.keynode('getEvents'),
                $easyselectors=KeyNode.options.selectors.easy;

            $(document).trigger($events.setup.easyform.submitBefore);
            if($($easyselectors.select).length
                    && $($easyselectors.select).val()!=="--nothing selected--"){
                var url=location.hostname+$($easyselectors.select).val();
                login.helper.setLastSelected(url);
                login.easyForm.getSettingsFromUrl(url);
            }else if($($easyselectors.url).length
                    && $($easyselectors.url).val().length>0){
                login.easyForm.getSettingsFromUrl($($easyselectors.url).val());
                login.helper.setLastSelected($($easyselectors.url).val());
            }else {
                $(document).trigger($events.setup.easyform.submitError,"Please select one Source.");
            }
        },
        getSettingsTimer : null ,
        getSettingsTimeout : null ,
        getSettingsFromUrl: function(url){
            var $events=$.keynode('getEvents');
            url=login.helper.urlCode(url);
            //console.log("getSettingsFromUrl: "+url);
            $('body').append('<iframe id="temper" style="display:none;"></iframe>');
            $('#temper').attr('src',url);
            login.easyForm.getSettingsTimer=window.setInterval(function(){
                document.getElementById('temper').contentWindow.postMessage("getSettings:",url);
            },500);
            login.easyForm.getSettingsTimeout=setTimeout(function(){
                window.clearInterval(login.easyForm.getSettingsTimer);
                $('#temper').remove();
                //console.log("Couldn't get Settings from URL.");
                $(document).trigger($events.setup.easyform.submitError,"Couldn't get Settings from URL.");
            },6000);
            window.addEventListener("message", login.receivePostMessage, false);
        },
        handleSettingsReceive : function(str){
            window.clearInterval(login.easyForm.getSettingsTimer);
            window.clearTimeout(login.easyForm.getSettingsTimeout);
            $('#temper').remove();
            var myObject = JSON.parse(str);
            var $events=$.keynode('getEvents');
            $(document).trigger($events.setup.easyform.submit);
            login.advancedForm.setSettings(myObject);
//            console.log(myObject);
//            //$('#presentationURLinput').attr('value',myObject.canonical);
//            for(i=0;i<myObject.server.length;i++){
//                login.addNodeServer(myObject.server[i]);
//            }
//            if(myObject.canonical !== $(KeyNode.options.selectors.cano_input).val()){               
//                $(KeyNode.options.selectors.pres_url_input).attr("value",$(KeyNode.options.selectors.cano_input).val()) ;
//                $(KeyNode.options.selectors.cano_input).attr("value",myObject.canonical) ;
//            }
        }
    },
    advancedForm:{
        serverSettings : null,
        removeNodeServer : function(srv){
            var $events=$.keynode('getEvents');
            this.serverSettings=$.keynode('getSetup');
            this.serverSettings.removeNodeServer(srv);
            $(document).trigger($events.setup.advancedform.nodeServerRemove,srv);
        },
        setSettings : function(object){
            var $events=$.keynode('getEvents');
            this.serverSettings=new Setup();
            $.keynode('setSetup',this.serverSettings);
            //test Canonical
            if(typeof(object.canonical)!=='string'||object.canonical===null||object.canonical==="") {
                $(document).trigger($events.setup.advancedform.canonicalError);
                throw Error("No Canonical URL is set.");
            } else {
                var url=login.helper.urlCode(object.canonical);
                this.serverSettings.setCanonicalURL(url);
                $(document).trigger($events.setup.advancedform.canonicalReady,this.serverSettings.getCanonicalURL());
            }
            //test URL
             if(typeof(object.url)!=='string'||object.url===null||object.url==="") {
                $(document).trigger($events.setup.advancedform.presentationURLWarning,"No alternative URL is set.");
            } else {
                var url=login.helper.urlCode(object.url);
                this.serverSettings.setPresentationURL(url);
                $(document).trigger($events.setup.advancedform.presentationURLReady,this.serverSettings.getPresentationURL());
            } 
            //test Server
            if(typeof(object.server)!=='object'){
                $(document).trigger($events.setup.advancedform.nodeServerError,"Serverobject not an Array. Watcher outdated?");
            }else{
                for(oneServer in object.server){
                    var url=login.helper.urlCode( object.server[oneServer]);
                    var pass= (typeof(object.passwords[oneServer])==='undefined')?null:object.passwords[oneServer];
                    var id=this.serverSettings.addNodeServer({
                        'url'       : url,
                        'password'  : pass
                    });
                    $(document).trigger($events.setup.advancedform.nodeServerNew,id);
                }
            }
            this.socketHandler = new SocketHandler();
            $.keynode('setSocketHandler',this.socketHandler);
            this.bindSubmit();
        },
        bindSubmit : function (){
            var $selectors=KeyNode.options.selectors.advanced;
            $("body").delegate( $selectors.submit, "click", login.advancedForm.submit );
        
        },
        submit : function(){
            var $events=$.keynode('getEvents'),
                $selectors=KeyNode.options.selectors.advanced;

            $(document).trigger($events.setup.advancedform.submitBefore);
                KeyNode.loadCSS('presenter');
		KeyNode.loadJS('keynode.presenter');
//		KeyNode.loadCSS('slidechooser');
//		KeyNode.loadJS('keynode.slidechooser');
//		KeyNode.loadCSS('timer');
//		KeyNode.loadJS('keynode.timer');
		//KeyNode.loadCSS('video');
		//KeyNode.loadJS('keynode.video');
                
                
                
        },
    },
    /*showMore : function(){
        $('#temper').remove();
        $(KeyNode.options.selectors.login_start_btn)
                .unbind('click')
                .click(login.submitToServer)
                .fadeIn('slow');
        //show  NodeServerURL things
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
            path=login.helper.urlCode(path);//if(path.indexOf("http://")===-1)path="http://"+path;
            login.addNodeServer(path);
        })
                .parent()
                .fadeIn('slow');
                    
        //show  presentationURL things
        $(KeyNode.options.selectors.pres_url)
                .fadeIn('slow');
        login.finishWorking();
    },*/
    receivePostMessage : function (event) {
        //console.log("receivePostMessage",event);
        if (event.data.indexOf('getDiff') !==-1) {
            event.source.postMessage("getDiff:"+diff,event.origin);
        } else 
            if (event.data.indexOf('setDiff') !==-1) {
                temp=event.data.substring(event.data.indexOf(':')+1);
                diff=temp;
                //event.source.postMessage('setDiff:true',event.origin);
            } else
            if (event.data.indexOf('getSettings') !==-1) {
                temp=event.data.substring(event.data.indexOf(':')+1);
                login.easyForm.handleSettingsReceive(temp);
            } else
            if (event.data.indexOf('getNumberSlides') !==-1) {
                temp=parseInt(event.data.substring(event.data.indexOf(':')+1));
                presenter.slideLength=(temp-1);
                
            } 

    },
            /*
    removeErrorDisplays : function () {
        $(KeyNode.options.selectors.error_class)
                .remove();
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
        login.removeErrorDisplays();
        login.nodeServer = [];
        $(KeyNode.options.selectors.node_saved).hide();
        $(KeyNode.options.selectors.node_container+' '+KeyNode.options.selectors.node_url_input).show();
        $(KeyNode.options.selectors.node_container+' '+KeyNode.options.selectors.node_mybutton).show();
        var cano = $(KeyNode.options.selectors.cano_input);
        //new IFRAME Methods
        $('body').append('<iframe id="temper" style="display:none;"></iframe>');
        $('#temper').attr('src',cano.val());
        setTimeout(function(){document.getElementById('temper').contentWindow.postMessage("getSettings:",cano.val());},5000);
        timertest=setTimeout(login.failGetSettings,5500);
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
    */
};
login.init();
