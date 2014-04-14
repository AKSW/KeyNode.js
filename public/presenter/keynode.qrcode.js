/* 
 * Copyright (c) 2012-2014, Gurkware Solutions GbR  All rights reserved. 
 * Uses: https://github.com/davidshimjs/qrcodejs
 */

var QRCodeDiplay = {
    $qrcode: null,
    init: function() {
        $('body').append('<div class="panel panel-default" id="qrcodeWrapper"><div class="panel-heading">To open the Presenter with your<br> Smartphone or Tablet just scan this Code:</div><div class="panel-body" id="qrcode"></div></div>');
        var qrcode = $('<div id="qrcodeTabWrapper" class="multibar-tab"><h2>QR-Code</h2></div>');
        qrcode.click(QRCodeDiplay.toggleDisplay);
        PresenterUI.MultiBar.add(qrcode, 11);
        $('#qrcodeWrapper').click(QRCodeDiplay.hide);
        QRCodeDiplay.show();
        
    },
    generateCode: function() {
        QRCodeDiplay.$qrcode = new QRCode(document.getElementById("qrcode"), {
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        }),
        
        QRCodeDiplay.$qrcode.clear(); // clear the code.
        QRCodeDiplay.$qrcode.makeCode(window.location.href);
    },
    toggleDisplay: function() {
        if ($('#qrcodeWrapper').is(':visible'))
            QRCodeDiplay.hide();
        else
            QRCodeDiplay.show();
    },
    show: function() {
        QRCodeDiplay.generateCode();
        $('#qrcodeWrapper').show('fast');
    },
    hide: function() {
        $('#qrcodeWrapper').hide('fast');
    }

};

KeyNode.loadJS('js/qrcode.min', function() {
    KeyNode.loadCSS('qrcode');
    QRCodeDiplay.init();
});
