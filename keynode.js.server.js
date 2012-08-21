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

io.configure(function () {
	//	io.set('transports', ['websocket', 'flashsocket', 'xhr-polling']);
	if (!Server_settings.debug) {
		io.set('log level', 1);
		io.enable('log');
	}
});


/**
 *  Init Socket.IO message handling:
 */

io.sockets.on('connection', function (socket) {
	var Client = socket;
	Client.on('SetAdmin', function (Json1) {
		Server_data.setAdminByKey(Json1.name, Json1.admin, Client,io);
                
	});
	Client.on('resetPassword', function (data) {
		Server_data.resetPassword(data, socket);
	});
	Client.on('ConnectToPres', function (name) {
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
                if(Server_data.Presentations[name].presenterOnline)
                    Client.emit('presenterOnline');
                
	});
	Client.on('giveMeAnAdminKeyFor', function (beNice) {
		var t = socket;
		socket.emit('hereIsYourAdminKey', Server_data.getAdminCode(t, beNice));
	});
	Client.on('controlSync', function (data) {
		if (Server_data.getAdmin(data.name) === socket.id) {
			if (Server_settings.debug) {
				console.log(Server_settings.preTagPres + data.name + ' goto ' + data.folie);
			}
			io.sockets.in(data.name).emit('GoTo', data.folie);
		} else {
			console.log('Someone tries to control a slide that is not his own one.');
		}
	});
	
	extensionVideo.initSocket(io, socket);
});

extensionVideo.init(io, fileServer);

