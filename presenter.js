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
 * Central Instance for Presenter
 * @version 1.0
 * @author Alrik Hausdorf
 */
var KeyNode = {
    init: function() {
        KeyNode.options = $.keynode('getOptions');
        KeyNode.loadCSS('parent');
        KeyNode.loadJS('keynode.setup', function() {
            KeyNode.loadJS('keynode.socket', function() {
                KeyNode.loadJS('js/base64', function() {
                    KeyNode.loadJS('keynode.login');
                });
            });
        });




    },
    loadCSS: function(path) {
        $('head').append('<link rel="stylesheet" href="' + './Template/' + KeyNode.options.template + '/' + path + '.css" />');
    },
    loadTmpl: function(path, callback) {
        if (typeof callback !== 'function')
            callback = function() {
            };
        $.get('./Template/' + KeyNode.options.template + '/' + path + '.tpl', function(data) {
            $('body').append(data);
            callback();
        }, 'html');
    },
    loadJS: function(path, callback) {
        if (typeof callback !== 'function')
            callback = function() {
            };
        $.getScript('./' + path + '.js', callback);
    },
    options: {}
};

(function($, keynode, document, undefined) {
    var $d = $(document),
            options = {},
            setup = null,
            socketHandler = null,
            slideNumber = 0,
            events = {
        setup: {
            easyform: {
                submit: 'SetupEasySubmit',
                submitBefore: 'SetupEasySubmitBefore',
                submitError: 'SetupEasySubmitError'
            },
            advancedform: {
                canonicalError: 'SetupAdvancedCanonicalError',
                canonicalReady: 'SetupAdvancedCanonicalReady',
                presentationURLWarning: 'SetupAdvancedPresentationurlWarning',
                presentationURLReady: 'SetupAdvancedPresentationurlReady',
                socketIOReady: 'SetupAdvancedSocketIoReady',
                socketIOError: 'SetupAdvancedSocketIoError',
                nodeServerError: 'SetupAdvancedNodeserverError',
                nodeServerNew: 'SetupAdvancedNodeserverNew',
                nodeServerRemove: 'SetupAdvancedNodeserverRemove',
                submit: 'SetupAdvancedSubmit',
                submitBefore: 'SetupAdvancedSubmitBefore',
                submitError: 'SetupAdvancedSubmitError'
            }
        },
        nodeServer: {
            binding: 'NodeserverBinding',
            connected: 'NodeserverConnected',
            diconnected: 'NodeserverDiconnected',
            ident: 'NodeserverIdent',
            passReset: 'NodeserverPassReset',
            ready: 'NodeserverReady',
            passSet: 'NodeserverPassSet'
        },
        presenter: {
            slideChange: 'presenterSlideChange',
            ready: 'presenterReady',
            init: 'presenterInit'
        }
    },
    methods = {
        init: function(opts) {
            $d.trigger(events.presenter.init);
            
            options = $.extend(true, {}, $[keynode].defaults, opts);
            
            KeyNode.init();
            $d.trigger(events.presenter.ready);

        },
        getOptions: function() {
            return options;
        },
        getEvents: function() {
            return events;
        },
        setSetup: function(arg) {
            if (typeof arg === "object")
                setup = arg;
            return this;
        },
        getSetup: function() {
            if (setup === null)
                setup = new Setup();
            return setup;
        },
        setSocketHandler: function(arg) {
            if (typeof arg === "object")
                socketHandler = arg;
            return this;
        },
        getSocketHandler: function() {
            return socketHandler;
        }
    };
    /* jQuery extension */
    $[keynode] = function(method, arg) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else {
            if(typeof(method)==="object")
                return methods.init(method);
            else
                return methods.init(arg);
        }
    };



    $[keynode].defaults = {
        template: 'default', 
        selectors: {
            easy: {
                wrapper: '#easyForm', //for test if it exist
                url: '#easyurl', //EasySetup URL-input
                select: '#easyselect', //EasySetup URL-Select
                submit: '#easysubmit'     //BTN for Submit
            },
            advanced: {
                submit: '#advancedsubmit'
            },
            /* presenter tpl */
            slide_container: '#slide_container',
            current_container: '#slide_current',
            current_frame: '#CurrentFrame',
            after_container: '#slide_after',
            after_frame: '#AfterFrame',
            click_blocker: '.clickBlocker',
        },
        message: {
            id: '#message',
            timeout_time: 2000,
        },
        keys: {
            // enter, space, page down,  down arrow, left arrow,
            next: [13, 32, 34, 40, 39],
            // backspace, page up,  up arrow, right arrow
            previous: [8, 33, 38, 37],
            // 
            gotoRight: [4],
            // 
            gotoLeft: [5]
        }

    };

})(jQuery, 'keynode', document);
