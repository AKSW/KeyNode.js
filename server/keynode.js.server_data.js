this.Presentations = null;
var GlobalthisThing = this;
var Server_settings = require('./keynode.js.server_settings');
this.FHandler = require('fs');
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
				//TODO: Anzahl listener zurücksetzen
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
/**
 * Ident the User as Admin by testing the AdminCode
 *
 */
this.setAdminByKey = function (name, key, socket) {
	var i = 0;
	for (i in GlobalthisThing.Presentations[name].adminCodes) {
		if ((' ' + GlobalthisThing.Presentations[name].adminCodes[i]).trim() === key) {
			GlobalthisThing.Presentations[name].admin = socket.id;
			GlobalthisThing.savePresData();
			return true;
		}
	}
	return false;
};
/**
*	Reset the Password ot a Presentation
*	
*
*/
this.resetPassword = function (data) {
	if ((Server_settings.localInstallation) && (typeof data !== 'undefined')) {
		GlobalthisThing.Presentations[data.name].adminCodes = [Server_settings.standardPassword];
		GlobalthisThing.savePresData();
		console.log(Server_settings.preTagServerData + ' password reset to: "' + GlobalthisThing.Presentations[data.name].adminCodes[0] + '"');
		return 'local';
	} else {
		if ((!Server_settings.localInstallation) && (typeof data !== 'undefined')) {
			GlobalthisThing.Presentations[data.name].adminCodes = [Server_settings.standardPassword];
			GlobalthisThing.savePresData();
			if (typeof nodemailer === 'undefined') {
				var nodemailer = require(Server_settings.NodeMailerPackage);
			}
			if (Server_settings.useMail) {
				var request = require(Server_settings.RequestPackage);
				request(data.name, function (error, response, body) {
					if (!error && response.statusCode === 200) {
						var re = new RegExp(/<link.rel=["']http:\/\/ns.aksw.org\/keynode\/mailto['"].+href=['"]mailto:(.+)['"].+\/>/i);
						var arrMatches = body.match(re);
						var Mail = arrMatches[1];
						var transport = nodemailer.createTransport(Server_settings.mailProto, Server_settings.smtp_options);
						var mailOptions = {
							from: "passwordreset@KeyNodeServer.com",
							to: Mail,
							subject: "Passwordreset for your Presentation",
							text: "You have reset your password for : \n\r" + data.name + '\n\rYour new Password: ' + GlobalthisThing.Presentations[data.name].adminCodes[0] + '\n\r\n\rYour NodeServer'
						};
						transport.sendMail(mailOptions);
						return 'mail';
					}
				});
			}
		}
	}
};

/**
 * get an AdminCode
 *
 */
this.getAdminCode = function (socket, name) {
	if (this.Presentations[name].adminCodes === null) {
		this.Presentations[name].adminCodes = [];
		this.Presentations[name].adminCodes[0] = (Math.floor(Math.random() * 4257671236709));
		GlobalthisThing.savePresData();
		return this.Presentations[name].adminCodes[0];
	} else {
		if (socket.id === this.Presentations[name].admin) {
			var i = 0;
			while (true) {
				if (typeof (this.Presentations[name].adminCodes[i]) === undefined) {
					this.Presentations[name].adminCodes[i] = (Math.floor(Math.random() * 4257671236709));
					GlobalthisThing.savePresData();
					return this.Presentations[name].adminCodes[i];
				}
				i += 1;
			}
		}
	}
};
console.log(Server_settings.preTagInfo + ' Server_Data.js loaded.');
