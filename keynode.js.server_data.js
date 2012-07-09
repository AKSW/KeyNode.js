this.Presentations = null;
var GlobalthisThing = this;
var Server_settings = require('./keynode.js.server_settings');
this.FHandler = require(Server_settings.fsPackage);
this.crypto = require(Server_settings.cryptoPackage);
/**
 * init The Presentations object
 *
 */
this.initPres = function () {
	this.Presentations = {};
};
/**
 * add new Pres to The Presentations object
 *
 */
this.addPres = function (name) {
	if (this.Presentations === null) {
		this.loadPresData();
	}
	if (typeof this.Presentations[name] === 'undefined') {
		this.Presentations[name] = {};
	}
	this.initAdmin(name);
	this.initAdminCodes(name);
	GlobalthisThing.savePresData();
	console.log(Server_settings.preTagServerData + ' New Presentation: ' + name);
};

/**
 * save the Presentationdata to file
 *
 */
this.savePresData = function () {
	var str = JSON.stringify(this.Presentations);
	this.FHandler.writeFile('./serverData.save', String(str), function (err) {
		if (err) {
			console.log(Server_settings.preTagServerData + ' error when saving the presentation data.');
			return false;
		} else {
			console.log(Server_settings.preTagServerData + ' presentation data saved!');
			return true;
		}
	});
};
/**
 * load Presentationdata from file
 *
 */
this.loadPresData = function () {
	if (this.Presentations === null) {
		this.FHandler.readFile('./serverData.save', function (err, data) {
			if (err) {
				GlobalthisThing.initPres();
				GlobalthisThing.savePresData();
				console.log(Server_settings.preTagServerData + ' presentation data created');
			} else {
				GlobalthisThing.Presentations = JSON.parse(data);
				//TODO: Anzahl listener zur�cksetzen
				console.log(Server_settings.preTagServerData + ' presentation data loaded');
			}
			return true;
		});
	}
};
/**
 * get the Presentation
 *
 */
this.getPres = function (name) {
	if (this.Presentations === null) {
		return null;
	} else {
		return this.Presentations[name];
	}
};
//Admins
/**
 * Init the List of Admins
 *
 */
this.initAdmin = function (name) {
	this.Presentations[name].admin = null;
	return true;
};
/**
 * Did the Presentation have an registered Admin?
 *
 */
this.HasAdmin = function (name) {
	return this.Presentations[name].admin === null ? false : true;
};
/**
 * get the Registered Admin
 *
 */
this.getAdmin = function (name) {
	if (this.Presentations[name].admin !== null) {
		return this.Presentations[name].admin;
	} else {
		return "getTESTERAdminCode";
	}
};
/**
 * Init the List of AdminCodes
 *
 */
this.initAdminCodes = function (name) {
	this.Presentations[name].adminCodes = [];
	this.Presentations[name].adminCodes[0] = Server_settings.standardPassword;
};

this.setAdminEvents = function (name,socket) {
    io.sockets
        .in(name)
        .emit('presenterOnline');
    socket.on('disconnect', function () {
        io.sockets
            .in(name)
            .emit('presenterOffline');
    });
}

/**
 * Ident the User as Admin by testing the AdminCode
 *
 */
this.setAdminByKey = function (name, key, socket) {
	var i = 0;
        var md5TestString=this.crypto.createHash('md5').update(key).digest("hex");
        var md5TestString_send=this.crypto.createHash('md5').update(md5TestString).digest("hex");
	for (i in GlobalthisThing.Presentations[name].adminCodes) {
            md5TestString=this.crypto.createHash('md5').update((' ' + GlobalthisThing.Presentations[name].adminCodes[i]).trim()).digest("hex");
            var md5TestString2=this.crypto.createHash('md5').update(md5TestString).digest("hex");
		if ( md5TestString2 === md5TestString_send) {
			GlobalthisThing.Presentations[name].admin = socket.id;
			GlobalthisThing.savePresData();
                            socket.emit('identAsAdmin', {
                            "name" : name,
                            'ident' : 'ADMIN'
                            });
                        GlobalthisThing.setAdminEvents(name,socket);
                        console.log(Server_settings.preTagServer + " Client " + socket.id + " ACCESS GRANTED");
			return true;
		}
	}
        try {
            //try to get an MD5(MD5(password)) from the Canonical URL
            var request = require(Server_settings.RequestPackage);
            request(name, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    //<meta name="password" content="65e769bcfba3cc2a78d7ea32c59b7e09">-->tester
                    var re2 = new RegExp(/<meta.name=["']password['"].+content=['"](.+)['"]>/i),
                    arrMatches2 = body.match(re2);	
                    if (arrMatches2) {
                        if(arrMatches2[1]==md5TestString_send)
                        {
                            GlobalthisThing.Presentations[name].admin = socket.id;
                            GlobalthisThing.savePresData();
                            socket.emit('identAsAdmin', {
                                "name" : name,
                                'ident' : 'ADMIN'
                                });
                            GlobalthisThing.setAdminEvents(name,socket);    
                            console.log(Server_settings.preTagServer + " Client " + socket.id + " ACCESS GRANTED");
                        } else {
                            socket.emit('identAsAdmin', {
                                "name" : name,
                                'ident' : 'USER'
                                });
                            console.log(Server_settings.preTagServer + " Client  " + socket.id + ' ACCESS DENIED');
                        }
                    } else {
                        socket.emit('identAsAdmin', {
                            "name" : name,
                            'ident' : 'USER'
                            });
                        console.log(Server_settings.preTagServer + " Client  " + socket.id + ' ACCESS DENIED');
                    }
                }
                    
            });
        } catch (err) { 
            socket.emit('identAsAdmin', {
                "name" : name,
                'ident' : 'USER'
                });
            console.log(Server_settings.preTagServer + " Client  " + socket.id + ' ACCESS DENIED');
            
            console.log(err); }
};
/**
*	Reset the Password of a Presentation
*	
*
*/
this.resetPassword = function (data,socket) {
	if ((Server_settings.localInstallation) && (typeof data !== 'undefined')) {
		GlobalthisThing.Presentations[data.name].adminCodes = [Server_settings.standardPassword];
		GlobalthisThing.savePresData();
		console.log(Server_settings.preTagServerData + ' password reset to: "' + GlobalthisThing.Presentations[data.name].adminCodes[0] + '"');
		socket.emit('resetedPassword', {
			"name" : data.name,
			"type" : 'localReset'
		});
	} else {
		if ((!Server_settings.localInstallation) && (typeof data !== 'undefined')) {
			if (typeof nodemailer === 'undefined') {
				var nodemailer = require(Server_settings.NodeMailerPackage);
			}
			if (Server_settings.useMail) {
				var request = require(Server_settings.RequestPackage);
				request(data.name, function (error, response, body) {
					if (!error && response.statusCode === 200) {
						var re = new RegExp(/<link.rel=["']http:\/\/ns.aksw.org\/keynode\/mailto['"].+href=['"]mailto:(.+)['"].+\/>/i),
							arrMatches = body.match(re);
						if (arrMatches) {
							var Mail = arrMatches[1];
							if (Mail !== '') {
								GlobalthisThing.Presentations[data.name].adminCodes = [Server_settings.standardPassword];
								GlobalthisThing.savePresData();
								var transport = nodemailer.createTransport(Server_settings.mailProto, Server_settings.smtp_options),
									mailOptions = {
										from: "passwordreset@KeyNodeServer.com",
										to: Mail,
										subject: "Passwordreset for your Presentation",
										text: "You have reset your password for : \n\r" + data.name + '\n\rYour new Password: ' + GlobalthisThing.Presentations[data.name].adminCodes[0] + '\n\r\n\rYour NodeServer'
									};
								transport.sendMail(mailOptions);
								socket.emit('resetedPassword', {
									"name" : data.name,
									"type" : 'mailReset'
								});
							} else {
								socket.emit('resetedPassword', {
									"name" : data.name,
									"type" : 'fail-noMail'
								});
							}
						} else {
							socket.emit('resetedPassword', {
								"name" : data.name,
								"type" : 'fail-noMail'
							});
						}
					}
				});
			}
		}
	}
};
console.log(Server_settings.preTagInfo + ' Server_Data.js loaded.');