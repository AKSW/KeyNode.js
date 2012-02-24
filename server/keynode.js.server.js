var Server_settings = require('./keynode.js.server_settings');
var Server_data = require('./keynode.js.server_data');
/**
 *	Init Server on Server_Port
 *
 */

var io = require('socket.io').listen(Server_settings.Server_Port);

console.log(Server_settings.preTagInfo+' Server lauscht auf Port ' + Server_settings.Server_Port + '.');
Server_data.loadPresData();

io.configure(function () {
 //io.set("origins","*");
  //io.set("origins = *");
//	io.set('transports', ['websocket', 'flashsocket', 'xhr-polling']);
	//io.set('log level', 1);
	io.enable('log');
});

io.sockets.on('connection', function (socket) {
	var Client = socket;
	Client.on('SetAdmin', function (Json1) {
		console.log(Server_settings.preTagServer+" Identversuch: " + Client.id);
		if (Server_data.setAdminByKey(Json1.name, Json1.admin, socket)) {
			socket.emit('identAsAdmin', {
				"name" : Json1.name,
				'ident' : 'ADMIN'
			})
			console.log(Server_settings.preTagServer+" Identversuch: " + Client.id + " Erfolgreich!");
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
				console.log(Server_settings.preTagPres+' Neue angelegt: "' + name + '"');
				Client.join(name);
				console.log(Server_settings.preTagPres+ Client.id + ' wurde dem Raum ' + name + ' hinzugefügt! Jetzt sind es: '+io.sockets.in(name).clients().length.toString()+' Listener');
				
				Client.emit('Ready', "");
			}
		} else {
			Client.join(name);
			console.log(Server_settings.preTagPres+ Client.id + ' wurde dem Raum ' + name + ' hinzugefügt! Jetzt sind es: '+io.sockets.in(name).clients().length.toString()+' Listener');

			if (!Server_data.HasAdmin(name))
				Client.emit('Ready', "");
			else {
				Client.emit('Ready');
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
		 console.log(Server_settings.preTagPres+ 'Goto :' +data.folie)
		 io.sockets.in(data.name).emit('GoTo',data.folie);
		}
		else{console.log('Kontrolle der Folien von nonAdmin')}
	});
	
});
