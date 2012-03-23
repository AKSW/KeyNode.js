function loadCss(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}
require([
        "https://raw.github.com/imakewebthings/deck.js/b4cd21693c5bdee6096aff02e6e4e9eb9376bb58/modernizr.custom.js",
        "https://raw.github.com/imakewebthings/deck.js/master/core/deck.core.js",
        "https://github.com/imakewebthings/deck.js/raw/master/extensions/menu/deck.menu.js",
        "https://raw.github.com/imakewebthings/deck.js/master/extensions/goto/deck.goto.js",
        "https://github.com/imakewebthings/deck.js/raw/master/extensions/status/deck.status.js",
        "https://github.com/imakewebthings/deck.js/raw/master/extensions/navigation/deck.navigation.js",
        "https://github.com/imakewebthings/deck.js/raw/master/extensions/hash/deck.hash.js",
        "https://raw.github.com/AKSW/KeyNode.js/master/watcher/keynode.watch.js"
        ], function() {
            // Deck initialization-->
            $.deck('.slide');
        }
       );

