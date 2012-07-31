
/**
 *  Indicator for the state of presentation
 *
 *
 **/

var presState ={
    /**
    *  Stings in different languages
    *
    **/
    lang:{
        de:{
            offline:'keine Verbindung',
            online:'Verbunden, warte auf Präsentator',
            presenting:'Präsentation wird gehalten',
        },
        eng:{
            offline:'no connection to server',
            online:'connected, waiting for presenter',
            presenting:'presentation in process',
        }

    },
    strings:null,
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
            'padding-top':'1px',
            'text-align':'center',
            'float':'left',
            '-webkit-border-radius': '8px',
            '-moz-border-radius': '8px',
            'border-radius': '8px',
        },
        
    },
    setOffline:function(){
        this.stateDiv.node.attr('style',this.stateDiv.gradOne).css(this.stateDiv.CSS);//red
        this.content.setText(this.strings.offline);
    },
    setOnline:function(){
        this.stateDiv.node.attr('style',this.stateDiv.gradTwo).css(this.stateDiv.CSS);//red
        this.content.setText(this.strings.online);
    },
    setPresented:function(){
        this.stateDiv.node.attr('style',this.stateDiv.gradThree).css(this.stateDiv.CSS);//red
        this.content.setText(this.strings.presenting);
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
        if (navigator.language.indexOf("de") > -1) {
            this.strings=this.lang.de;
        }else{
            this.strings=this.lang.eng;
        }
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
        /**
         * Bind the events of the presenter
         */
        $(document).bind('watcher.GoToSlide', function(event,to) {
            /**
             * shows the number of the last broadcasted Slide in the statusbar.
             */
            presState.stateDiv.node.html(to+1);
        });
        $(document).bind('watcher.setOnline', function() {
            presState.setOnline();
        });
        $(document).bind('watcher.setOffline', function() {
            presState.setOffline();
        });        
        $(document).bind('watcher.setPresented', function() {
            presState.setPresented();
        }); 
    },
    show: function(){
        this.elem.show().animate(this.showCSS,200);
    },
    hide: function(){
        this.elem.show().animate(this.hideCSS,200);
    }
};
/**
 * bind the init-function to the beforinit-event of the Watcher
 */
$(document).bind('watcher.beforeInit', function() {
    presState.init();
})
