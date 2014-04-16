/**
 * 
 * Save all runtime Settings/setups
 * 
 * @version 0.1.0
 * @author Alrik Hausdorf <admin@morulia.de>
 * @type Setupobject type
 */
var Setup = window.Setup || {};

var Setup = function() {
    /**
     * Canonical URL to ident Deck
     * @private
     * @type String
     */
    var $canonicalURL = null;
    var $presentationURL = null;


    var $nodeServer = [];


    return {
        setCanonicalURL: function(canoURL) {
            if (typeof canoURL === "string")
                $canonicalURL = canoURL;
            return this;
        },
        getCanonicalURL: function() {
            return $canonicalURL === null ? "" : $canonicalURL;
        },
        setPresentationURL: function(presentationURL) {
            if (typeof presentationURL === "string")
                $presentationURL = presentationURL;
            return this;
        },
        getPresentationURL: function() {
            return $presentationURL === null ? $canonicalURL : $presentationURL;
        },
        getNodeServers: function() {
            return $nodeServer;
        },
        updateNodeServerPassword: function(srv, pass) {
            var $socket = $.keynode('getSocketHandler');
            for (ele in $nodeServer)
                if ($nodeServer[ele].url === srv) {
                    $nodeServer[ele].password = pass;
                    $socket.reIdentServer(srv);
                }
        },
        addNodeServer: function(srv) {
            var next = -1;
            for (ele in $nodeServer) {
                if (typeof srv === "string") {
                    if ($nodeServer[ele].url === srv)
                        return;
                }
                if (typeof srv === "object") {
                    if ($nodeServer[ele].url === srv.url) {
                        if ($nodeServer[ele].password === srv.password) {
                            return;
                        } else {
                            updateNodeServerPassword(srv.url, srv.password);
                        }
                    }
                }
                next = (ele > next) ? ele : next;
            }
            next++;
            
            if (typeof srv === "string")
                $nodeServer[next] = {
                    'url': srv,
                    'state': 0,
                    'password': null,
                    'socket': null
                };
            else if (typeof srv === "object")
                $nodeServer[next] = {
                    'url': srv.url || null,
                    'state': srv.state || 0,
                    'password': srv.password || null,
                    'socket': srv.socket || null
                };
            return next;
        },
        /**
         * remove Nodeserver by ID or URL
         * @param int||String srv
         * @returns Setup
         */
        removeNodeServer: function(srv) {
            if (typeof srv === "int") {
                if (typeof $nodeServer[srv] === 'undefined')
                    throw Error("nodeServer not found");
                else
                    $nodeServer[srv] = null;
            } else if (typeof srv === "string") {
                for (ele in $nodeServer){
                    if($nodeServer[ele].url === srv) $nodeServer.splice(ele,1) ;
                }

            }
            return this;
        },
        /**
         * get Nodeserver Object by ID or URL
         * @param int||String srv
         * @returns Nodeserver-Object of false
         */
        getNodeServer: function(srv) {
            if (typeof srv === "number") {
                return $nodeServer[srv];
            } else if (typeof srv === "string") {
                for (ele in $nodeServer)
                    if ($nodeServer[ele].url === srv)
                        return $nodeServer[ele];

            }
            return false;
        },
        /**
         * tests if setup got enough information for Presentation
         * @returns Boolean 
         */
        isReady: function(){
            var $socket = $.keynode('getSocketHandler');
            if($canonicalURL===null) return false;
            if($nodeServer.length<=0) return false;
             for (ele in $nodeServer){
                 if($nodeServer[ele].state===$socket.connectionStates.AUTH_SUCCESS) return true;
                 if($nodeServer[ele].state===$socket.connectionStates.AUTH_ANONYM) return true;
             }
        },
        /**
         * get Base64 String of this Setup
         * @returns Base64 String 
         */
        getSetupString: function() {
            var server = [];
            for (ele in $nodeServer)
                server[server.length] = {
                    "url": $nodeServer[ele].url,
                    "password": $nodeServer[ele].password
                };
            var ret = {
                "c": $canonicalURL,
                "p": $presentationURL,
                "ns": server
            };
            var text = JSON.stringify(ret);
            return Base64.encode(text);
        },
        /**
         * set Setup from a Base64 coded String  
         * 
         * @returns Base64 String 
         */
        setSetupString: function(string) {
            
            var obj = JSON.parse(Base64.decode(string));
            $canonicalURL = obj.c || null;
            $presentationURL = obj.p || null;
            $nodeServer=[];
            if (obj.ns) {
                for (ele in obj.ns)
                   this.addNodeServer(obj.ns[ele]); 
            }
            return;
        }

    };
};