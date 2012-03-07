var Server_settings = require('./keynode.js.server_settings');
var Server_data = require('./keynode.js.server_data');

/**
 *	Init Server on Server_Port
 *
 */
var io = require('socket.io').listen(Server_settings.Server_Port);

console.log(Server_settings.preTagInfo + ' server listen at port ' + Server_settings.Server_Port + '.');
Server_data.loadPresData();

io.configure(function () {
	//	io.set('transports', ['websocket', 'flashsocket', 'xhr-polling']);
	if (Server_settings.debug) {
		io.set('log level', 1);
		io.enable('log');
	}
});

io.sockets.on('connection', function (socket) {
	var Client = socket;
	Client.on('SetAdmin', function (Json1) {
		if (Server_data.setAdminByKey(Json1.name, Json1.admin, socket)) {
			socket.emit('identAsAdmin', {
				"name" : Json1.name,
				'ident' : 'ADMIN'
			});
			console.log(Server_settings.preTagServer + " Client " + Client.id + " ACCESS GRANTED");
		} else {
			socket.emit('identAsAdmin', {
				"name" : Json1.name,
				'ident' : 'USER'
			});
			console.log(Server_settings.preTagServer + " Client  " + Client.id + ' ACCESS DENIED');
		}
	});
	Client.on('resetPassword', function (data) {
		var result = Server_data.resetPassword(data);
		if (result ===  'local') {
			socket.emit('resetedPassword', {
				"name" : data.name,
				"type" : 'localReset'
			});
		} else {
			if (result ===  'mail') {
				socket.emit('resetedPassword', {
					"name" : data.name,
					"type" : 'mailReset'
				});
			}
		}
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
		console.log(Server_settings.preTagPres + 'Client ' + Client.id + ' added to room ' + name + '.  There are ' + io.sockets.in(name).clients().length.toString() + ' listener.');
		Client.emit('Ready', "");
	});
	Client.on('giveMeAnAdminKeyFor', function (beNice) {
		var t = socket;
		socket.emit('hereIsYourAdminKey', Server_data.getAdminCode(t, beNice));
	});
	Client.on('controlSync', function (data) {
		if (Server_data.getAdmin(data.name) === socket.id) {
			console.log(Server_settings.preTagPres + 'Goto :' + data.folie);
			io.sockets.in(data.name).emit('GoTo', data.folie);
		} else {
			console.log('Someone try to controll a slide that doesn´t be his own.');
		}
	});
});
