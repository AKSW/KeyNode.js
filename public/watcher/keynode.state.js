/*
 *  Copyright (C) 2011 Alrik Hausdorf
 *  
 *  This file is part of KeyNode.JS.
 * 
 *  KeyNode.JS is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  KeyNode.JS is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with KeyNode.JS.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */

/**
 * State extension for Watcher extension
 * @version 1.0
 * @author Alrik Hausdorf
 */
var presState = {
    /**
     *  Stings in different languages
     *
     **/
    lang: {
        de: {
            disconnected: 'keine Verbindung',
            connected: 'Verbunden, warte auf Präsentator',
            presenting: 'Präsentation wird gehalten',
        },
        eng: {
            disconnected: 'no connection to server',
            connected: 'connected, waiting for presenter',
            presenting: 'presentation in process',
        }

    },
    /**
     * if user follows Presentation
     * @type Bool
     */
    followPres: true,
    servers: [],
    const: {
        'OFFLINE': 0,
        'ONLINE': 1,
        'PRESENTED': 2
    },
    strings: null,
    elem: null,
    selectorID: 'presState',
    cssGradient: "   background: rgb(214,249,255);\
            background: -moz-linear-gradient(top, rgba(214,249,255,1) 0%, rgba(158,232,250,1) 100%);\
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(214,249,255,1)), color-stop(100%,rgba(158,232,250,1)));\
            background: -webkit-linear-gradient(top, rgba(214,249,255,1) 0%,rgba(158,232,250,1) 100%);\
            background: -o-linear-gradient(top, rgba(214,249,255,1) 0%,rgba(158,232,250,1) 100%);\
            background: -ms-linear-gradient(top, rgba(214,249,255,1) 0%,rgba(158,232,250,1) 100%);\
            background: linear-gradient(to bottom, rgba(214,249,255,1) 0%,rgba(158,232,250,1) 100%);\
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#d6f9ff', endColorstr='#9ee8fa',GradientType=0 );",
    CSS: {
        'display': 'none',
        'position': 'fixed',
        'overflow': 'hidden',
        'z-Index': '1000',
        'top': '0px',
        'right': '0px',
        '-webkit-border-bottom-left-radius': '7px',
        '-moz-border-radius-bottomleft': '7px',
        'border-bottom-left-radius': '7px',
    },
    content: {
        node: null,
        selectorID: 'contentDiv',
        CSS: {
            'display': 'block',
            'font-size': '10pt',
            'overflow': 'hidden',
            'height': 'auto',
            'margin': '5px',
            'float': 'left',
        },
        setText: function(text) {
            this.node.html(text);
        }
    },
    stateDiv: {
        node: null,
        selectorID: 'stateDiv',
        /* red */
        gradOne: "background: rgb(169,3,41);\
                background: -moz-linear-gradient(top,  rgba(169,3,41,1) 0%, rgba(143,2,34,1) 44%, rgba(109,0,25,1) 100%);\
                background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(169,3,41,1)), color-stop(44%,rgba(143,2,34,1)), color-stop(100%,rgba(109,0,25,1)));\
                background: -webkit-linear-gradient(top,  rgba(169,3,41,1) 0%,rgba(143,2,34,1) 44%,rgba(109,0,25,1) 100%);\
                background: -o-linear-gradient(top,  rgba(169,3,41,1) 0%,rgba(143,2,34,1) 44%,rgba(109,0,25,1) 100%);\
                background: -ms-linear-gradient(top,  rgba(169,3,41,1) 0%,rgba(143,2,34,1) 44%,rgba(109,0,25,1) 100%);\
                background: linear-gradient(to bottom,  rgba(169,3,41,1) 0%,rgba(143,2,34,1) 44%,rgba(109,0,25,1) 100%);\
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#a90329', endColorstr='#6d0019',GradientType=0 );\
                ",
        /* yellow */
        gradTwo: "background: rgb(255,255,5);\
                background: -moz-linear-gradient(top,  rgba(255,255,5,1) 0%, rgba(232,209,4,1) 45%, rgba(239,227,59,1) 100%);\
                background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(255,255,5,1)), color-stop(45%,rgba(232,209,4,1)), color-stop(100%,rgba(239,227,59,1)));\
                background: -webkit-linear-gradient(top,  rgba(255,255,5,1) 0%,rgba(232,209,4,1) 45%,rgba(239,227,59,1) 100%);\
                background: -o-linear-gradient(top,  rgba(255,255,5,1) 0%,rgba(232,209,4,1) 45%,rgba(239,227,59,1) 100%);\
                background: -ms-linear-gradient(top,  rgba(255,255,5,1) 0%,rgba(232,209,4,1) 45%,rgba(239,227,59,1) 100%);\
                background: linear-gradient(to bottom,  rgba(255,255,5,1) 0%,rgba(232,209,4,1) 45%,rgba(239,227,59,1) 100%);\
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffff05', endColorstr='#efe33b',GradientType=0 );\
                ",
        /* green */
        gradThree: "background: rgb(180,227,145);\
                background: -moz-linear-gradient(top,  rgba(180,227,145,1) 0%, rgba(97,196,25,1) 50%, rgba(180,227,145,1) 100%);\
                background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(180,227,145,1)), color-stop(50%,rgba(97,196,25,1)), color-stop(100%,rgba(180,227,145,1)));\
                background: -webkit-linear-gradient(top,  rgba(180,227,145,1) 0%,rgba(97,196,25,1) 50%,rgba(180,227,145,1) 100%);\
                background: -o-linear-gradient(top,  rgba(180,227,145,1) 0%,rgba(97,196,25,1) 50%,rgba(180,227,145,1) 100%);\
                background: -ms-linear-gradient(top,  rgba(180,227,145,1) 0%,rgba(97,196,25,1) 50%,rgba(180,227,145,1) 100%);\
                background: linear-gradient(to bottom,  rgba(180,227,145,1) 0%,rgba(97,196,25,1) 50%,rgba(180,227,145,1) 100%);\
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b4e391', endColorstr='#b4e391',GradientType=0 );\
                ",
        CSS: {
            'display': 'block',
            'cursor': 'pointer',
            'height': '20px',
            'width': '20px',
            'margin': '5px',
            'padding-top': '0px',
            'text-align': 'center',
            'font-size': '100%',
            'float': 'left',
            '-webkit-border-radius': '8px',
            '-moz-border-radius': '8px',
            'border-radius': '8px',
        }
    },
    revalidateDisplay: function() {
        var online = [], presented = [];
        for (ele in this.servers) {
            if (this.servers[ele] === this.const.ONLINE) {
                online[online.length] = ele;
            } else
            if (this.servers[ele] === this.const.OFFLINE) {
                ;
            } else
            if (this.servers[ele] === this.const.PRESENTED) {
                presented[presented.length] = ele;
            }

        }
        if (presented.length > 0) {//PRESENTED
            this.stateDiv.node
                    .attr('title', (presented.toString().trim()))
                    .attr('style', this.stateDiv.gradThree)
                    .css(this.stateDiv.CSS);//green
            this.content.setText(this.strings.presenting);
        } else if (online.length > 0) {//ONLINE
            this.stateDiv.node
                    .attr('style', this.stateDiv.gradTwo)
                    .css(this.stateDiv.CSS);//yellow
            this.content.setText(this.strings.connected);
        } else {//OFFLINE
            this.stateDiv.node
                    .attr('style', this.stateDiv.gradOne)
                    .css(this.stateDiv.CSS);//red
            this.content.setText(this.strings.disconnected);
        }
    },
    /* from Socket disconnect */
    setDisconnected: function(server) {
        this.servers[server.url] = this.const.ONLINE;
        this.revalidateDisplay();
    },
    /* Presenter offline */
    setOffline: function(server) {
        this.servers[server.url] = this.const.OFFLINE;
        this.revalidateDisplay();
    },
    /* connected to Socket and ident for deck */
    setOnline: function(server) {
        this.servers[server.url] = this.const.ONLINE;
        this.revalidateDisplay();
    },
    /* Presenter online */
    setPresented: function(server) {
        this.servers[server.url] = this.const.PRESENTED;
        this.revalidateDisplay();
    },
    showCSS: {
        'height': 'auto',
        'width': 'auto',
    },
    hideCSS: {
        'height': '0px',
        'width': '0px',
    },
    init: function() {
        if (navigator.language.indexOf("de") > -1) {
            this.strings = this.lang.de;
        } else {
            this.strings = this.lang.eng;
        }
        if (this.elem === null) {
            var element = '<div id="' + this.selectorID + '" style="' + this.cssGradient + '">\
                        <div id="' + this.stateDiv.selectorID + '"></div>\
                        <div id="' + this.content.selectorID + '"></div>\
                        </div>';
            $('body').append(element)
                    .find('#' + this.selectorID).css(this.CSS)
                    .find('#' + this.stateDiv.selectorID).css(this.stateDiv.CSS).parent()
                    .find('#' + this.content.selectorID).css(this.content.CSS);

            this.elem = $('#' + this.selectorID);
            this.stateDiv.node = $('#' + this.stateDiv.selectorID);
            this.content.node = $('#' + this.content.selectorID);

            this.show();
            //DISPLAY AS OFFLINE
            this.stateDiv.node
                    .attr('style', this.stateDiv.gradOne)
                    .css(this.stateDiv.CSS);//red
            this.content.setText(this.strings.disconnected);

        }
        /**
         * Bind the events of the presenter
         */
        $(document).bind('watcherGoToSlide', function(event, to1) {
            /**
             * shows the number of the last broadcasted Slide in the statusbar.
             */
            presState.stateDiv.node.html(to1 + 1);
            var to = to1;
            presState.elem.unbind('click').click(function(e) {
                try {
                    $.deck('go', to);
                } catch (e) {
                }
            });

        });
        $(document).bind('watcherSetOnline', function(e, server) {
            presState.setOnline(server);
        });
        $(document).bind('watcherSetDisconnected', function(e, server) {
            presState.setOffline(server);
        });
        $(document).bind('watcherSetOffline', function(e, server) {
            presState.setOffline(server);
        });
        $(document).bind('watcherSetPresented', function(e, server) {
            presState.setPresented(server);
        });
    },
    show: function() {
        this.elem.show().animate(this.showCSS, 200);
    },
    hide: function() {
        this.elem.show().animate(this.hideCSS, 200);
    }
};
/**
 * bind the init-function to the beforinit-event of the Watcher
 */
$(document).bind('watcherBeforeInit', function() {
    presState.init();
});

