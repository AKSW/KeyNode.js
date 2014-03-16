
var KeyNode = {
    init : function () {
        KeyNode.options=$.keynode('getOptions');
        KeyNode.loadCSS('parent');
        KeyNode.loadJS('keynode.setup');
        KeyNode.loadJS('keynode.login');
        KeyNode.loadJS('keynode.socket');
                
    },
    loadCSS : function (path) {
        $('head').append('<link rel="stylesheet" href="' + './Template/' + KeyNode.options.template.src + '/' + path + '.css" />');
    },
    loadTmpl : function (path) {
        $.get('./Template/' + KeyNode.options.template.src + '/' + path + '.tpl', function (data) {
            $('body').append(data);
        }, 'html');
    },
    loadJS : function (path,callback) {
        if(typeof callback !== 'function')
            callback= function(){};
        $.getScript('./' + path + '.js',callback);
    },
    options:{}
};

(function($, keynode, document, undefined) {
    var $d = $(document),
    options = {},
    setup = null,
    socketHandler = null,
    slideNumber = 0,
    events = {
        
        setup:{
            easyform:{
                localPresentationsLoaded    : 'SetupEasyLocalReady', //loaded local presentations
                localPresentationsError     : 'SetupEasyLocalError', //error while loading local presentations
                
                submit                      : 'SetupEasySubmit',
                submitBefore                : 'SetupEasySubmitBefore',
                submitError                 : 'SetupEasySubmitError'
            },
            advancedform:{
                canonicalError              : 'SetupAdvancedCanonicalError',
                canonicalReady              : 'SetupAdvancedCanonicalReady',
                
                presentationURLWarning      : 'SetupAdvancedPresentationurlWarning',
                presentationURLReady        : 'SetupAdvancedPresentationurlReady',
                
                socketIOReady               : 'SetupAdvancedSocketIoReady',
                socketIOError               : 'SetupAdvancedSocketIoError',
                
                nodeServerError             : 'SetupAdvancedNodeserverError',
                nodeServerNew               : 'SetupAdvancedNodeserverNew',
                nodeServerRemove            : 'SetupAdvancedNodeserverRemove',
                
                submit                      : 'SetupAdvancedSubmit',
                submitBefore                : 'SetupAdvancedSubmitBefore',
                submitError                 : 'SetupAdvancedSubmitError'
            }
        },
        nodeServer:{
            binding           : 'NodeserverBinding',
            connected         : 'NodeserverConnected',
            diconnected       : 'NodeserverDiconnected',
            ident             : 'NodeserverIdent',
            passReset         : 'NodeserverPassReset',
            ready             : 'NodeserverReady'
        },
        presenter:{
            slideChange             : 'presenterSlideChange',
            ready                   : 'presenterReady',
            init                    : 'presenterInit'
        }   
    },
    methods = {
        init:function(opts){
            $d.trigger(events.presenter.init);

            options = $.extend(true, {}, $[keynode].defaults, opts);
           
            KeyNode.init();
            $d.trigger(events.presenter.ready);
            
        },
        getOptions:function(){
            return options;
        },
        getEvents:function(){
            return events;
        },
        setSetup:function(arg){
            if(typeof arg === "object") 
                setup = arg;
            return this;
        },
        getSetup:function(){
            return setup;
        },
        setSlideNumber:function(arg){
            if(typeof arg === "number") 
                slideNumber = arg;
            return this;
        },
        getSlideNumber:function(){
            return slideNumber;
        },
        setSocketHandler:function(arg){
            if(typeof arg === "object") 
                socketHandler = arg;
            return this;
        },
        getSocketHandler:function(){
            return socketHandler;
        }
    };
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
            easy : {
                wrapper : '#easyForm',      //for test if it exist
                url     : '#easyurl',       //EasySetup URL-input
                select  : '#easyselect',    //EasySetup URL-Select
                submit  : '#easysubmit'     //BTN for Submit
            },
            advanced : {
                submit  : '#advancedsubmit'
            },
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
            // enter, space, page down,  down arrow, left arrow,
            next: [13, 32, 34,  40, 39],
            // backspace, page up,  up arrow, right arrow
            previous: [8, 33, 38, 37],
            // 
            gotoRight:[4],
            // 
            gotoLeft:[5]
        }
		
    };
    
})(jQuery, 'keynode', document);
