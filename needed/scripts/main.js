function loadCss(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}
require([
        "../deck.js/modernizr.custom",
        "../deck.js/core/deck.core",
        "../deck.js/extensions/menu/deck.menu",
        "../deck.js/extensions/goto/deck.goto",
        "../deck.js/extensions/status/deck.status",
        "../deck.js/extensions/navigation/deck.navigation",
        "../deck.js/extensions/hash/deck.hash"
        ], function() {
            // Deck initialization-->
            $.deck('.slide');
        }
       );

