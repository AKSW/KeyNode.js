
var login = {
    init: function() {
        KeyNode.loadCSS('login');
        KeyNode.loadTmpl('login');
        login.easyForm.bindSubmit();
        login.advancedForm.bindSubmit();
        window.addEventListener("message", login.receivePostMessage, false);
    },
    hashPreTag: ":!/",
    helper: {
        urlCode: function(url) {
            if (url.indexOf("http://") === -1)
                url = "http://" + url;
            return url;
        },
        getLastSelected: function() {
            if (!login.helper.supportsHtml5Storage())
                return "";
            if (!window['localStorage'])
                return "";
            var storage = window['localStorage'];
            var foo = storage.getItem("LastSelectedUrl");
            return foo;
        },
        setLastSelected: function(url) {
            if (!login.helper.supportsHtml5Storage())
                return false;
            if (!window['localStorage'])
                return false;
            var storage = window['localStorage'];
            storage.setItem("LastSelectedUrl", url);
        },
        supportsHtml5Storage: function() {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        }
    },
    easyForm: {
        bindSubmit: function() {
            var $easyselectors = KeyNode.options.selectors.easy;
            if (!$($easyselectors.url)[0]) {
                setTimeout(function() {
                    login.easyForm.bindSubmit();
                }, 100);
                return;
            }
            $("body").delegate($easyselectors.submit, "click", login.easyForm.submit);
            $("body").delegate($easyselectors.url, "keydown", function(e) {
                if (e.keyCode === 13) {
                    login.easyForm.submit();
                }
            });
            var value = login.helper.getLastSelected();
            var sel = $easyselectors.url;
            $(sel).val(value);

        },
        submit: function() {
            var $events = $.keynode('getEvents'),
                    $easyselectors = KeyNode.options.selectors.easy;
            $(document).trigger($events.setup.easyform.submitBefore);
            if ($($easyselectors.select).length
                    && $($easyselectors.select).val() !== "--nothing selected--") {
                var url = location.host + $($easyselectors.select).val();
                login.helper.setLastSelected(url);
                login.easyForm.getSettingsFromUrl(url);
            } else if ($($easyselectors.url).length
                    && $($easyselectors.url).val().length > 0) {
                login.easyForm.getSettingsFromUrl($($easyselectors.url).val());
                login.helper.setLastSelected($($easyselectors.url).val());
            } else {
                $(document).trigger($events.setup.easyform.submitError, "Please select one Source.");
            }
        },
        getSettingsTimer: null,
        getSettingsTimeout: null,
        getSettingsFromUrl: function(url) {
            var $events = $.keynode('getEvents');
            url = login.helper.urlCode(url);
            $('body').append('<iframe id="temper" style="display:none;"></iframe>');
            $('#temper').attr('src', url);
            login.easyForm.getSettingsTimer = window.setInterval(function() {
                document.getElementById('temper').contentWindow.postMessage("getSettings:", url);
            }, 500);
            login.easyForm.getSettingsTimeout = setTimeout(function() {
                window.clearInterval(login.easyForm.getSettingsTimer);
                $('#temper').remove();
                $(document).trigger($events.setup.easyform.submitError, "Couldn't get Settings from URL.");
            }, 6000);

        },
        handleSettingsReceive: function(str) {
            window.clearInterval(login.easyForm.getSettingsTimer);
            window.clearTimeout(login.easyForm.getSettingsTimeout);
            $('#temper').remove();
            var myObject = JSON.parse(str);
            var $events = $.keynode('getEvents');
            $(document).trigger($events.setup.easyform.submit);
            login.advancedForm.setSettings(myObject);
        }
    },
    advancedForm: {
        serverSettings: null,
        socketHandler: null,
        removeNodeServer: function(srv) {
            var $events = $.keynode('getEvents');
            this.serverSettings = $.keynode('getSetup');
            this.serverSettings.removeNodeServer(srv);
            $(document).trigger($events.setup.advancedform.nodeServerRemove, srv);
        },
        addNodeServer: function(srv) {
            var $events = $.keynode('getEvents');
            var url = login.helper.urlCode(srv);
            this.serverSettings = $.keynode('getSetup');
            var id = this.serverSettings.addNodeServer(url);

            if (this.socketHandler === null)
                this.socketHandler = new SocketHandler();
            $(document).trigger($events.setup.advancedform.nodeServerNew, id);
        },
        startWithHash: function(hash) {
            this.serverSettings = new Setup();
            $.keynode('setSetup', this.serverSettings);
            this.serverSettings.setSetupString(hash);

            var $events = $.keynode('getEvents');
            $(document).trigger($events.setup.easyform.submit);

            $(document).trigger($events.setup.advancedform.canonicalReady, this.serverSettings.getCanonicalURL());
            $(document).trigger($events.setup.advancedform.presentationURLReady, this.serverSettings.getPresentationURL());
            var servers = this.serverSettings.getNodeServers();
            for (oneServer in servers) {
                $(document).trigger($events.setup.advancedform.nodeServerNew, servers[oneServer].url);
            }
            this.socketHandler = new SocketHandler();
            $.keynode('setSocketHandler', this.socketHandler);

        },
        setSettings: function(object) {
            var $events = $.keynode('getEvents');
            this.serverSettings = new Setup();
            $.keynode('setSetup', this.serverSettings);
            //test Canonical
            if (typeof(object.canonical) !== 'string' || object.canonical === null || object.canonical === "") {
                $(document).trigger($events.setup.advancedform.canonicalError, "No Canonical URL is set.");
            } else {
                var url = login.helper.urlCode(object.canonical);
                this.serverSettings.setCanonicalURL(url);
                $(document).trigger($events.setup.advancedform.canonicalReady, this.serverSettings.getCanonicalURL());
            }
            //test URL
            if (typeof(object.url) !== 'string' || object.url === null || object.url === "") {
                $(document).trigger($events.setup.advancedform.presentationURLWarning, "No alternative URL is set.");
            } else {
                var url = login.helper.urlCode(object.url);
                this.serverSettings.setPresentationURL(url);
                $(document).trigger($events.setup.advancedform.presentationURLReady, this.serverSettings.getPresentationURL());
            }
            //test Server
            if (typeof(object.server) !== 'object') {
                $(document).trigger($events.setup.advancedform.nodeServerError, "Serverobject not an Array. Watcher outdated?");
            } else {
                for (oneServer in object.server) {
                    var url = login.helper.urlCode(object.server[oneServer]);
                    var pass = (typeof(object.passwords[oneServer]) === 'undefined') ? null : object.passwords[oneServer];
                    var id = this.serverSettings.addNodeServer({
                        'url': url,
                        'password': pass
                    });
                    $(document).trigger($events.setup.advancedform.nodeServerNew, id);
                }
            }
            this.socketHandler = new SocketHandler();
            $.keynode('setSocketHandler', this.socketHandler);

        },
        bindSubmit: function() {
            var $selectors = KeyNode.options.selectors.advanced;
            $("body").delegate($selectors.submit, "click", login.advancedForm.submit);

        },
        submit: function() {
            this.serverSettings = $.keynode('getSetup');
            var $events = $.keynode('getEvents');
            if (this.serverSettings === null || !this.serverSettings.isReady()) {
                $(document).trigger($events.setup.advancedform.submitError, "For submit you need at least the canonicalURL set and one running KeynodeJS Server.");
                return;
            }
            window.location.hash = login.hashPreTag + this.serverSettings.getSetupString();

            $(document).trigger($events.setup.advancedform.submitBefore);
            KeyNode.loadCSS('presenter');
            KeyNode.loadJS('keynode.presenter');
            //not performant
//            KeyNode.loadCSS('slidechooser');
//            KeyNode.loadJS('keynode.slidechooser');

            KeyNode.loadJS('keynode.timer');
            KeyNode.loadJS('keynode.video');
            KeyNode.loadJS('keynode.qrcode');
            $(document).trigger($events.setup.advancedform.submit);

        },
    },
    receivePostMessage: function(event) {
        if (event.data.indexOf('getDiff') !== -1) {
            event.source.postMessage("getDiff:" + diff, event.origin);
        } else
        if (event.data.indexOf('setDiff') !== -1) {
            temp = event.data.substring(event.data.indexOf(':') + 1);
            diff = temp;
        } else
        if (event.data.indexOf('getSettings') !== -1) {
            temp = event.data.substring(event.data.indexOf(':') + 1);
            login.easyForm.handleSettingsReceive(temp);
        } else
        if (event.data.indexOf('getNumberSlides') !== -1) {
            temp = parseInt(event.data.substring(event.data.indexOf(':') + 1));
            presenter.slideLength = (temp - 1);
        }

    }
};
login.init();
