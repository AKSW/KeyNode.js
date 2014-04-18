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
 * Socket Class for Presenter
 * @version 1.0
 * @author Alrik Hausdorf <admin@morulia.de>
 */
var SocketHandler = window.SocketHandler || {};

var SocketHandler = function() {

    var $events = $.keynode('getEvents');

    var $setup = $.keynode('getSetup');

    var $serverSocketIO = null;

    var timeRetryGetSocketIO = 5000;

    var consts = {
        "OFFLINE": 0,
        "ONLINE": 1,
        "READY": 2,
        "AUTH_ANONYM": 3,
        "AUTH_FAILED": 4,
        "AUTH_SUCCESS": 5
    };

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
        var nodes = $setup.getNodeServers();
        for (var server in nodes) {
            var protocol = nodes[server].url.substring(0, nodes[server].url.indexOf(":"));
            var rest = nodes[server].url.substring(nodes[server].url.indexOf(":") + 1);
            var port = (rest.indexOf(":") !== -1) ? rest.substring(rest.indexOf(":") + 1) : (protocol === "https") ? 443 : 80;
            nodes[server].socket = io.connect(nodes[server].url, {"port": port});
            bindEvents(nodes[server]);
        }

    }
    ;
    var listener = {
        connect: function(server) {
            server.state = consts.ONLINE;
//            console.log(server.url, " -- Connect");
            $(document).trigger($events.nodeServer.connected, server);
            //ident for Pres
            server.socket.emit('ConnectToPres', $setup.getCanonicalURL());
        },
        disconnect: function(server) {
            server.state = consts.OFFLINE;
//            console.log(server.url, " -- Disconnect");
            $(document).trigger($events.nodeServer.diconnected, server);
        },
        ready: function(server) {
            server.state = consts.READY;
//            console.log(server.url, " -- Ready");
            $(document).trigger($events.nodeServer.ready, server);
            server.socket.emit('SetAdmin', {
                "admin": server.password,
                "name": $setup.getCanonicalURL()
            });
            // server.socket.emit('identAsAdmin', $setup.getCanonicalURL());
        },
        ident: function(server, data) {
            if (data.ident === "ADMIN")
                server.state = consts.AUTH_SUCCESS;
            else if (data.ident === "ANONYM")
                server.state = consts.AUTH_ANONYM;
            else
                server.state = consts.AUTH_FAILED;
//            console.log(server.url, " -- ident: ", data);
            var eventData = {
                "server": server,
                "data": data
            };
            $(document).trigger($events.nodeServer.ident, eventData);
        },
        goto: function(server, data) {
//            console.log(server.url, " -- goto", data);

            $.keynode('setSlideNumber', data);
            try {
                presenter.slideNumber = data;
            } catch (e) {
            }
        },
        passwordReset: function(server, data) {
            var eventData = {
                "server": server,
                "data": data
            };
//            console.log(server.url, " -- passwordReset", eventData);
            $(document).trigger($events.nodeServer.passReset, eventData);
        },
        passwordSet: function(server, data) {
            var eventData = {
                "server": server,
                "data": data
            };
//            console.log(server.url, " -- passwordSet", eventData);
            $(document).trigger($events.nodeServer.passSet, eventData);
        }
    };
    function bindEvents(server1) {
        var server = server1;
//        console.log(server.url, " -- BINDING");
        $(document).trigger($events.nodeServer.binding, server);
        server.socket
                .removeAllListeners('connect')
                .on('connect',
                function() {
                    listener.connect(server);
                })
                .removeAllListeners('Ready')
                .on('Ready',
                function() {
                    listener.ready(server);
                })
                .removeAllListeners('GoTo')
                .on('GoTo',
                function(data) {
                    listener.goto(server, data);
                })
                .removeAllListeners('disconnect')
                .on('disconnect',
                function() {
                    listener.disconnect(server);
                })
                .removeAllListeners('identAsAdmin')
                .on('identAsAdmin',
                function(data) {
                    listener.ident(server, data);
                })
                .removeAllListeners('setPassword')
                .on('setPassword',
                function(data) {
                    listener.passwordSet(server, data);
                })
                .removeAllListeners('resetedPassword')
                .on('resetedPassword',
                function(data) {
                    listener.passwordReset(server, data);
                });

    }
    ;
    /**
     * try to get Socket IO from one of the Servers
     * @param {function|undefined} i wich iterator step
     * @param {function|undefined} callback function called at success
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
            nodes = $setup.getNodeServers();
            for (server in nodes) {
                servers[servers.length] = nodes[server];
            }
        }
        if(servers.length===0){
            window.setTimeout(function() {
                servers=null;
                getSocketIO(callback, 0);
            }, timeRetryGetSocketIO);
        }else{
            console.log("try to get it from:" + servers[i].url);
            $.ajax({
                timeout: 500,
                url: servers[i].url + '/socket.io/socket.io.js',
                dataType: "script"
            }).done(function() {
                $serverSocketIO = servers[i];
                $(document).trigger($events.setup.advancedform.socketIOReady, servers[i]);
                callback();
            }).fail(function() {
                $(document).trigger($events.setup.advancedform.socketIOError, servers[i]);
                i = i + 1;
                if (typeof (servers[i]) === typeof(undefined)) {
                    window.setTimeout(function() {
                        servers=null;
                        getSocketIO(callback, 0);
                    }, timeRetryGetSocketIO);

                } else {
                    getSocketIO(callback, i);
                }
            });
        }
    }
    ;
    /**
     * Init SocketHandler
     * 
     */
    function init() {
        if (!hasSocketIO())
            return getSocketIO(init);
        connectServers();

    }
    ;
    delete window.io;
    init();
    return {
        connectionStates : consts,
        reinit: function() {
            delete window.io;
            servers = null;
            init();
        },
        reIdentServer: function(url) {
            var nodes = $setup.getNodeServers();
            for (ele in nodes)
                if (nodes[ele].url === url) {
                    var server = nodes[ele];

                }

            server.socket.emit('SetAdmin', {
                "admin": server.password,
                "name": $setup.getCanonicalURL()
            });
        },
        broadcast: function(message, data) {
            var nodes = $setup.getNodeServers();
            for (var server in nodes) {
                nodes[server].socket.emit(message, data);
            }
        },
        bind: function(message, func) {
            var nodes = $setup.getNodeServers();
            for (var server in nodes) {
                nodes[server].socket.removeAllListeners(message).on(message, func);
            }
        }
    };
};
