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
	io.set('transports', ['websocket', 'flashsocket', 'xhr-polling']);
	io.enable('log');
});

io.sockets.on('connection', function (socket) {
	
	socket.on('ConnectToPres', function (name) {
		if (!Server_data.getPres(name)) {
			//Server neue Presentation anlernen
			if (Server_settings.allow_new_presentations)
				Server_data.addPres(name);
			console.log('[Presentation] Neue angelegt: "' + name + '"');
			socket.emit('NewPresentation', "Jenau");
			
		} else {
			Server_data.addUser2Pres(name);
			if (!Server_data.getPres(name).HasAdmin())
				socket.emit('NewPresentation', "Jenau");
			
		}
	});
	socket.on('giveMeAnAdminKeyFor', function (beNice) {
		var t = socket;
		socket.emit('hereIsYourAdminKey', Server_data.getPres(beNice).getAdminCode(t));
	})
	socket.on('msg', function () {
		socket.get('nickname', function (err, name) {
			console.log('Chat message by ', name);
		});
	});
});
