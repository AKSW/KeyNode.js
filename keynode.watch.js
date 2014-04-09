/**
 * Watcher extension fpr deck.JS
 * @version 1.0b
 */
var diff = 0;

var myTimer = null,
        currSlide = 0,
        CanonicalURL = $("link[rel='http://ns.aksw.org/keynode/canonical']")[0] ? $("link[rel='http://ns.aksw.org/keynode/canonical']").attr("href") : null,
        NodeServerPasswords = null,
        NodeServer = null,
        mysocket = null,
        Mail = $("link[rel='http://ns.aksw.org/keynode/mailto']")[0] ? $("link[rel='http://ns.aksw.org/keynode/mailto']").attr("href") : null;

/**
 * Socket for the communication with the server
 *
 */
var SocketHandler = function($deck) {

    var $events = null;

    var $serverSocketIO = null;
    var $lastActiveServer = null;

    var timeRetryGetSocketIO = 10000;
    var timeoutGetSocketIO = 500;

    var servers = null;
    /**
     * tests for socketIO
     * @returns {Boolean} true/false if socket io is there
     */
    function hasSocketIO() {
        return (typeof (io) === typeof(undefined)) ? false : true;
    }
    ;
    function connectServers() {

        var nodes = NodeServer;
        for (var server in nodes) {
            var protocol = nodes[server].url.substring(0, nodes[server].url.indexOf(":"));
            var rest = nodes[server].url.substring(nodes[server].url.indexOf(":") + 1);
            var port = (rest.indexOf(":") !== -1) ? rest.substring(rest.indexOf(":") + 1) : (protocol === "https") ? 443 : 80;
            nodes[server].socket = io.connect(nodes[server].url, {"port": port});
            bindEvents(nodes[server]);
        }
        $(document).trigger($events.bindSocketEvents, server);
    }
    function findServer() {
        NodeServer = [];
        $("link[rel='http://ns.aksw.org/keynode/server']").each(function() {
            var url = $(this).attr("href");
            if (url.charAt(url.length - 1) === '/') {
                url = url.substring(0, (url.length - 1));
            }
            NodeServer[NodeServer.length] = {
                "url": url,
                "socket": null,
                "state": 0
            }
        });
    }
    ;
    var listener = {
        connect: function(server) {
            server.state = 1;
//            console.log(server.url, " -- Connect");
            $lastActiveServer = server;
            $(document).trigger($events.setConnected, server);
            //ident for Pres
            server.socket.emit('ConnectToPres', CanonicalURL);
        },
        disconnect: function(server) {
            server.state = 0;
//            console.log(server.url, " -- Disconnect");

            $(document).trigger($events.setDisconnected, server);
        },
        ready: function(server) {
//            console.log(server.url, " -- Ready");
            $(document).trigger($events.setOnline, server);
        },
        presenterOnline: function(server) {
//            console.log(server.url, " -- presenterOnline");
            $(document).trigger($events.setPresented, server);
        },
        presenterOffline: function(server) {
//            console.log(server.url, " -- presenterOffline");

            $(document).trigger($events.setOffline, server);
        },
        GoTo: function(server, data) {
//            console.log(server.url, " -- GoTo");
            $.deck('go', (data + diff));
            currSlide = (data + diff);
            $(document).trigger($events.watcherChange, data);
        }
    };
    function bindEvents(server1) {
        var server = server1;
//        console.log(server.url, " -- BINDING");

        server.socket
                .removeAllListeners('connect')
                .on('connect', function() {
            listener.connect(server);
        })
                .removeAllListeners('Ready')
                .on('Ready', function() {
            listener.ready(server);
        })
                .removeAllListeners('disconnect')
                .on('disconnect', function() {
            listener.disconnect(server);
        })
                .removeAllListeners('presenterOnline')
                .on('presenterOnline', function() {
            listener.presenterOnline(server);
        })
                .removeAllListeners('presenterOffline')
                .on('presenterOffline', function() {
            listener.presenterOffline(server);
        })
                .removeAllListeners('GoTo')
                .on('GoTo', function(data) {
            listener.GoTo(server, data);
        });

    }
    /**
     * try to get Socket IO from one of the Servers
     * @param {function|undefined} i
     * @param {function|undefined} callback
     * @returns void
     */
    function getSocketIO(callback, i) {
        if (typeof (callback) === typeof(undefined))
            callback = function() {
            };
        if (typeof (i) === typeof(undefined))
            i = 0;
        if (servers === null) {
            servers = [];
            nodes = NodeServer;
            for (server in nodes) {
                servers[servers.length] = nodes[server];
            }
        }
        $.ajax({
            timeout: timeoutGetSocketIO,
            url: servers[i].url + '/socket.io/socket.io.js',
            dataType: "script"
        }).done(function() {
            $serverSocketIO = servers[i];
            callback();
        }).fail(function() {
            i = i + 1;
            if (typeof (servers[i]) === typeof(undefined)) {
                window.setTimeout(function() {
                    getSocketIO(callback, 0);
                }, timeRetryGetSocketIO);

            } else {
                getSocketIO(callback, i);
            }
        });
    }
    /**
     * Init SocketHandler
     * 
     */
    function init() {
        findServer();
        $events = $deck('getOptions').events;
        if (!hasSocketIO())
            return getSocketIO(init);
//        console.log('found Socket IO @ ',$serverSocketIO.url);
        connectServers();

    }
    init();
    return {
        reinit: function() {
            servers = null;
            init();
        },
        getSocket: function() {
            return ($lastActiveServer === null) ? null : $lastActiveServer.socket;
        }
    };
};

(function($, deck, undefined) {
    var $d = $(document);

    var hash = document.location.href.split('#')[1];
    if (hash && hash.match(/^slidechooser-slide-([0-9]+)/)) {
        var slideNo = parseInt(RegExp.$1);
        // This document is just a slidechooser slide preview:
        $d.bind('deck.init', function() {
            $[deck]('go', slideNo);
        });
        return;     // stop initialization
    }


    $.extend(true, $[deck].defaults, {
        classes: {},
        selectors: {},
        keys: {},
        events: {
            /*
             Event fired whenever a new slidenumber is recived.
             */
            watcherChange: 'watcherGoToSlide',
            /*
             Event fired before the Init of the login
             */
            beforeInitialize: 'watcherBeforeInit',
            /*
             Event fired when the presenter is started
             */
            initialize: 'watcherInit',
            /*
             Event fired after the PostMessages are bind
             */
            bindPostMessages: 'watcherBindPostMessages',
            bindSocketEvents: 'watcherBindSocketEvents',
            receivePostMessage: 'watcherReceivePostMessage',
            setOnline: 'watcherSetOnline',
            setConnected: 'watcherSetConnected',
            setDisconnected: 'watcherSetDisconnected',
            setPresented: 'watcherSetPresented',
            setOffline: 'watcherSetOffline'
        }
    });
    $[deck]('extend', 'watcherReceivePostMessage', function(event) {
        $d.trigger($[deck]('getOptions').events.receivePostMessage);
        if (event.data.indexOf('getDiff') !== -1) {
            event.source.postMessage(("getDiff:" + diff), event.origin);
        } else if (event.data.indexOf('getNumberSlides') !== -1) {
            event.source.postMessage(('getNumberSlides:' + $.deck('getSlides').length), event.origin);
        } else if (event.data.indexOf('setDiff') !== -1) {
            if (presState)
                presState.hide();
            temp = event.data.substring(event.data.indexOf(':') + 1);
            diff = parseInt(temp);
            if ((diff !== -1) && (diff !== 1))
                alert(temp);
        } else if (event.data.indexOf('getSettings') !== -1) {
            var tmpPasswords = "";
            if (NodeServerPasswords !== null)
                for (i = 0; i < NodeServerPasswords.length; i++) {
                    if (i === 0)
                        tmpPasswords += '"' + NodeServerPasswords[i] + '"';
                    else
                        tmpPasswords += ',"' + NodeServerPasswords[i] + '"';
                }
            tmpPasswords = '[' + tmpPasswords + ']';
            var tmpServer = "";
            for (i = 0; i < NodeServer.length; i++) {
                if (i === 0)
                    tmpServer += '"' + NodeServer[i].url + '"';
                else
                    tmpServer += ',"' + NodeServer[i].url + '"';
            }
            tmpServer = '[' + tmpServer + ']';
            event.source.postMessage('getSettings:{"canonical":"' + CanonicalURL + '","server":' + tmpServer + ',"passwords":' + tmpPasswords + ',"mail":"' + Mail + '","url":"' + document.URL + '"}', event.origin);
        }

    });
    $[deck]('extend', 'watcherBindPostMessages', function() {
        $d.trigger($[deck]('getOptions').events.bindPostMessages);
        window.addEventListener("message", function(data) {$[deck]('watcherReceivePostMessage', data);}, false);
    });

    $[deck]('extend', 'watcherInit', function() {

        if ((!$("link[rel='http://ns.aksw.org/keynode/password']")[0]) && (NodeServerPasswords === null))
            NodeServerPasswords = [];
        $("link[rel='http://ns.aksw.org/keynode/password']").each(function() {
            if (NodeServerPasswords === null)
                NodeServerPasswords = [];
            NodeServerPasswords[NodeServerPasswords.length] = $(this).attr("href");
        });
        if ((CanonicalURL === null) && (!$("link[rel='http://ns.aksw.org/keynode/canonical']")[0])) {
            setTimeout($[deck]('watcherInit'), 200);
        } else {
            if (!$("link[rel='http://ns.aksw.org/keynode/server']")[0]) {
                setTimeout(function() {
                    $[deck]('watcherInit');
                }, 200);
            } else {
                var socket = new SocketHandler($[deck]);
                mysocket = socket;
                CanonicalURL = $("link[rel='http://ns.aksw.org/keynode/canonical']").attr("href");

                $[deck]('watcherBindPostMessages');
            }
        }
    });

    $[deck]('extend', 'watcherGetLastSlide', function() {
        return currSlide;
    });

    $d.bind('deck.init', function() {
        $d.trigger($[deck]('getOptions').events.beforeInitialize);
        $[deck]('watcherInit');
        $d.trigger($[deck]('getOptions').events.initialize);
    });
})(jQuery, 'deck');

