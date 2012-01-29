var Server_settings = require('./keynode.js.server_settings');
var Server_data = require('./keynode.js.server_data');
/**
 *	Init Server on Server_Port
 *
 */

var io = require('socket.io').listen(Server_settings.Server_Port);

console.log('[Info] Server lauscht auf Port ' + Server_settings.Server_Port + '.');
Server_data.loadPresData();

io.configure(function () {
//	io.set('transports', ['websocket', 'flashsocket', 'xhr-polling']);
	io.set('log level', 1);
	//io.enable('log');
});

io.sockets.on('connection', function (socket) {
	var Client = socket;
	Client.on('SetAdmin', function (Json1) {
		console.log("[Server] Identversuch: " + Client.id);
		if (Server_data.setAdminByKey(Json1.name, Json1.admin, socket)) {
			socket.emit('identAsAdmin', {
				"name" : Json1.name,
				'ident' : 'ADMIN'
			})
			console.log("[Server] Identversuch: " + Client.id + " Erfolgreich!");
		} else {
			socket.emit('identAsAdmin', {
				"name" : Json1.name,
				'ident' : 'USER'
			})
		}
	});
	Client.on('ConnectToPres', function (name) {
		if (!Server_data.getPres(name)) {
			//Server neue Presentation anlernen
			if (Server_settings.allow_new_presentations) {
				Server_data.addPres(name);
				console.log('[Presentation] Neue angelegt: "' + name + '"');
				socket.join(name);
				console.log(socket.sid + ' wurde dem Raum ' + name + ' hinzugefügt!');
				
				socket.emit('Ready', "NeuOhneAdmin");
			}
		} else {
			Server_data.addUser2Pres(name);
			socket.join(name);
			console.log(socket.sid + ' wurde dem Raum ' + name + ' hinzugefügt!');

			if (!Server_data.HasAdmin(name))
				socket.emit('Ready', "OhneAdmin");
			else {
				socket.emit('Ready');
			}
			
		}
	});
	Client.on('giveMeAnAdminKeyFor', function (beNice) {
		var t = socket;
		socket.emit('hereIsYourAdminKey', Server_data.getAdminCode(t, beNice));
	})
	Client.on('controlSync', function (data) {
	if(Server_data.getAdmin(data.name)==socket.id)
		 {
		 console.log('[Presentation] goto :' +data.folie)
		 io.sockets.in(data.name).emit('GoToFolie',data.folie);
		}
		else{console.log('Kontroll der Folien von nicht admin')}
	});
	
});
