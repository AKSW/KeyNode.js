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
 * KeyNode.JS - Server
 * @author Alrik Hausdorf
 * @version 1.0
 */
var Server_settings = require('./keynode.js.server_settings');
var Server_data = require('./keynode.js.server_data');

var extensionFileServer = require('./extensions/fileserver');
var extensionVideo = require('./extensions/video');


/**
 *	Init Server on Server_Port
 */
var fileServer = extensionFileServer.createServer(Server_settings.Server_Port);
var io = require(Server_settings.socketIoPackage).listen(fileServer.getHTTPServer());

console.log(Server_settings.preTagInfo + ' server is listening on port ' + Server_settings.Server_Port + '.');
Server_data.loadPresData();

/*
 * look very 10 sec for new Folders in Presentation-Folder
 */
Server_data.createLocalPresFile();
setInterval(function() {
    Server_data.createLocalPresFile();
}, 30000);


if (Server_settings.allowAnonymousAuth) {
    console.log(Server_settings.preTagServer + ' WARNING! anonymous mode enabled.');
}
io.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
if (!Server_settings.socketIOdebug) {
    io.set('log level', 1);
    io.enable('log');
}



/**
 *  Init Socket.IO message handling:
 */

io.sockets.on('connection', function(socket) {
    var Client = socket;
    Client.on('SetAdmin', function(Json1) {//ident
        Server_data.setAdminByKey(Json1.name, Json1.admin, Client, io);
    });
    Client.on('resetPassword', function(data) {
        Server_data.resetPassword(data, socket);
    });
    Client.on('setPassword', function(data) {
        Server_data.setPassword(data, socket);
    });
    Client.on('newPresentation', function(data) {
        Server_data.addPres(data.name, data.password);
        console.log(Server_settings.preTagPres + ' NEW presentation: "' + name + '"');
    });
    Client.on('ConnectToPres', function(name) {
        if (!Server_data.getPres(name)) {
            //Server neue Presentation anlernen
            if (Server_settings.allow_new_presentations) {
                Server_data.addPres(name);
                console.log(Server_settings.preTagPres + ' NEW presentation: "' + name + '"');
            }
        }
        Client.join(name);
        console.log(Server_settings.preTagPres + 'Client ' + Client.id + ' added to room ' + name + '.  There are ' + io.sockets.in(name).clients().length.toString() + ' listeners. ');
        Client.emit('Ready', "");
        if (Server_data.Presentations[name].presenterOnline) {
            Client.emit('presenterOnline');
            var slide = Server_data.getSlideNumber(name);
            Client.emit('GoTo', slide);
        }

    });
    Client.on('giveMeAnAdminKeyFor', function(beNice) {
        var t = socket;
        socket.emit('hereIsYourAdminKey', Server_data.getAdminCode(t, beNice));
    });
    Client.on('controlSync', function(data) {
        if (Server_data.isAdmin(data.name, socket)) {

            if (Server_settings.debug) {
                console.log(Server_settings.preTagPres + data.name + ' goto ' + data.folie);
            }
            io.sockets.in(data.name).emit('GoTo', data.folie);
            Server_data.setSlideNumber(data.name, data.folie);
        } else {
            console.log('Someone tries to control a slide that is not his own one.');
        }
    });

    extensionVideo.initSocket(io, socket);
});

extensionVideo.init(io, fileServer);

