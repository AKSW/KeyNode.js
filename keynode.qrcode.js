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
 * QRCodeDisplay Class for Presenter
 * @version 1.0
 * @author Alrik Hausdorf <admin@morulia.de>
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
        QRCodeDiplay.generateCode();
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
