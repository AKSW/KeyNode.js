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
 * KeyNode.JS - ServerData
 * @author Alrik Hausdorf
 * @version 1.0
 */
this.Presentations = null;
var GlobalthisThing = this;
var writeLock = false;
var Server_settings = require('./keynode.js.server_settings');

this.FHandler = require(Server_settings.fsPackage || "fs");
this.crypto = require(Server_settings.cryptoPackage || "crypto");
/**
 * init the Presentations object
 *
 */
this.initPres = function() {
    GlobalthisThing.Presentations = {};
};
/**
 * scans for local Presentations and create Json-File
 *
 */
this.createLocalPresFile = function() {
    if (Server_settings.debug)
        console.log(Server_settings.preTagServerData + ' Try to list local presentations.');
    var foldes = GlobalthisThing.FHandler.readdirSync(Server_settings.webRoot);
    if (!foldes.contains(Server_settings.presentationFolders)) {
        console.log(Server_settings.preTagServerData + ' Error: no presentationfolder found. Try to create it.');
        GlobalthisThing.FHandler.mkdirSync(Server_settings.webRoot + "/" + Server_settings.presentationFolders);
        var foldes = GlobalthisThing.FHandler.readdirSync(Server_settings.webRoot);
        if (!foldes.contains(Server_settings.presentationFolders)) {
            console.log(Server_settings.preTagServerData + 'Error: Can not create folder. Please create "' + Server_settings.presentationFolders + '"-folder in webroot.');
        }
    }
    var presFolders = GlobalthisThing.FHandler.readdirSync(Server_settings.webRoot + "/" + Server_settings.presentationFolders);
    for (var p in presFolders)
        presFolders[p] = "/" + Server_settings.presentationFolders + "/" + presFolders[p];

    var str = JSON.stringify(presFolders);
    this.FHandler.writeFile(Server_settings.webRoot + '/presentations.json', String(str), function(err) {
        if (err) {
            console.log(Server_settings.preTagServerData + ' error saving "presentations.json" .');
            return false;
        } else {
            if (Server_settings.debug)
                console.log(Server_settings.preTagServerData + ' "presentations.json" saved!');
            return true;
        }
    });

};

/**
 * add new Pres to The Presentations object
 *
 */
this.addPres = function(name, password) {
    if (typeof password === typeof undefined)
        password = null;
    if (GlobalthisThing.Presentations === null) {
        GlobalthisThing.loadPresData();
    }
    if (typeof GlobalthisThing.Presentations[name] === 'undefined') {
        GlobalthisThing.Presentations[name] = {};
    }
    GlobalthisThing.initAdmin(name);
    GlobalthisThing.setSlideNumber(name, 0);
    if (password !== null)
        GlobalthisThing.setPassword(password);
    GlobalthisThing.savePresData();
    console.log(Server_settings.preTagServerData + ' New Presentation: ' + name);
};

/**
 * save the Presentation data to file
 *
 */
this.savePresData = function() {
    if (GlobalthisThing.writeLock) {
        setTimeout(GlobalthisThing.savePresData, 500);
        return false;
    }
    GlobalthisThing.writeLock = true;
    var str = JSON.stringify(GlobalthisThing.Presentations);
    if (typeof str === typeof undefined) {
        GlobalthisThing.writeLock = false;
        setTimeout(GlobalthisThing.savePresData, 500);
        return false;
    }
    GlobalthisThing.FHandler.writeFile('./serverData.save', String(str), function(err) {
        if (err) {
            console.log(Server_settings.preTagServerData + ' error when saving the presentation data.');
            GlobalthisThing.writeLock = false;
            return false;
        } else {
            if (Server_settings.debug)
                console.log(Server_settings.preTagServerData + ' presentation data saved!');
            GlobalthisThing.writeLock = false;
            return true;
        }
    });
};
/**
 * load Presentation data from file
 *
 */
this.loadPresData = function() {
    if (GlobalthisThing.Presentations === null) {
        GlobalthisThing.FHandler.readFile('./serverData.save', function(err, data) {
            if (err) {
                GlobalthisThing.initPres();
                GlobalthisThing.savePresData();
                console.log(Server_settings.preTagServerData + ' presentation data created');
            } else {
                GlobalthisThing.Presentations = JSON.parse(data);
                for (var canoURL in GlobalthisThing.Presentations) {
                    GlobalthisThing.Presentations[canoURL].admin = [];
                    GlobalthisThing.Presentations[canoURL].presenterOnline = false;
                }

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
this.getPres = function(name) {
    if (GlobalthisThing.Presentations === null) {
        return null;
    } else {
        return GlobalthisThing.Presentations[name];
    }
};
this.setSlideNumber = function(name, slide) {
    GlobalthisThing.Presentations[name].slide = slide;
    GlobalthisThing.savePresData();
};
this.getSlideNumber = function(name) {
    return GlobalthisThing.Presentations[name].slide;
};

//Admins
/**
 * Init the list of admins
 *
 */
this.initAdmin = function(name) {
    GlobalthisThing.Presentations[name].admin = [];
    GlobalthisThing.Presentations[name].presenterOnline = false;
    GlobalthisThing.Presentations[name].allowAnonymousAuth = true;
    GlobalthisThing.savePresData();
    return true;
};
/**
 * Did the presentation allow Anonymous Auth?
 *
 */
this.allowAnonymousAuth = function(name) {
    return GlobalthisThing.Presentations[name].allowAnonymousAuth;
};
/**
 * Did the presentation have a registered admin?
 *
 */
this.hasAdmin = function(name) {
    return GlobalthisThing.Presentations[name].admin === [] ? false : true;
};
/**
 * add admin
 *
 */
this.addAdmin = function(name, socket) {
    GlobalthisThing.Presentations[name].admin.push(socket.id);
    GlobalthisThing.savePresData();

};
/**
 * remove admin
 *
 */
this.removeAdmin = function(name, socket) {
    var index = GlobalthisThing.Presentations[name].admin.indexOf(socket.id);
    if (index > -1) {
        GlobalthisThing.Presentations[name].admin.splice(index, 1);
        GlobalthisThing.savePresData();
        return true;
    }
    return false;
};
/**
 * Get the registered admins
 *
 */
this.getAdmins = function(name) {
    if (GlobalthisThing.Presentations[name].admin !== []) {
        return GlobalthisThing.Presentations[name].admin;
    } else {
        return "getTESTERAdminCode";
    }
};
/**
 * tests if socket.id is admin
 *
 */
this.isAdmin = function(name, socket) {
    if (GlobalthisThing.allowAnonymousAuth(name))
        return true;
    for (var admin1 in this.Presentations[name].admin) {
        if (GlobalthisThing.Presentations[name].admin[admin1] === socket.id)
            return true;
    }
    return false;
};
/**
 * Get the canonical URL of the presentation that's presenter
 * socket ID is `socketId`.
 */
this.getCanoURLByAdminSocketId = function(socketId) {
    for (var canoURL in GlobalthisThing.Presentations) {
        for (var admin in GlobalthisThing.Presentations[canoURL].admin) {
            if (GlobalthisThing.Presentations[canoURL].admin[admin] === socketId)
                return canoURL;
        }
    }
    return null;
};

this.setAdminEvents = function(name, socket, io) {
    if (GlobalthisThing.getAdmins(name).length > 0)
        GlobalthisThing.Presentations[name].presenterOnline = true;
    io.sockets
            .in(name)
            .emit('presenterOnline');
    var slide = GlobalthisThing.getSlideNumber(name);
    io.sockets
            .in(name)
            .emit('GoTo', slide);
    socket.on('disconnect', function() {
        GlobalthisThing.removeAdmin(name, socket);
        if (GlobalthisThing.getAdmins(name).length <= 0) {
            io.sockets
                    .in(name)
                    .emit('presenterOffline');
            GlobalthisThing.Presentations[name].presenterOnline = false;
        }



    });
    GlobalthisThing.savePresData();
};

/**
 * Identify the user as admin by testing the AdminCode
 *
 */
this.setAdminByKey = function(name, key, socket, io) {
    if ((Server_settings.allowAnonymousAuth) && (key === null) && GlobalthisThing.allowAnonymousAuth(name)) {
        GlobalthisThing.addAdmin(name, socket);
        GlobalthisThing.setAdminEvents(name, socket, io);
        socket.emit('identAsAdmin', {
            "name": name,
            'ident': 'ANONYM'
        });
        console.log(Server_settings.preTagServer + " Client " + socket.id + " ACCESS GRANTED");
        return true;
    }
    if ((typeof key === typeof undefined) || (key === null))
        key = "";
    //sendKey
    var md5TestString = GlobalthisThing.crypto.createHash('md5').update(((key + " ").trim()), 'utf8').digest("hex");
    var md5TestString_send = GlobalthisThing.crypto.createHash('md5').update(md5TestString, 'utf8').digest("hex");
    if (GlobalthisThing.Presentations[name].adminCode === md5TestString_send) {


        GlobalthisThing.addAdmin(name, socket);
        GlobalthisThing.setAdminEvents(name, socket, io);
        socket.emit('identAsAdmin', {
            "name": name,
            'ident': 'ADMIN'
        });
        console.log(Server_settings.preTagServer + " Client " + socket.id + " ACCESS GRANTED(Password)");
        return;
    }

    try {
        //try to get an MD5(MD5(password)) from the Canonical URL
        var request = require(Server_settings.RequestPackage);
        request(name, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                //<meta name="password" content="65e769bcfba3cc2a78d7ea32c59b7e09">-->tester
                var re2 = new RegExp(/<meta.name=["']password['"].+content=['"](.+)['"]>/i),
                        arrMatches2 = body.match(re2);
                if (arrMatches2) {
                    if (arrMatches2[1] === md5TestString_send)
                    {

                        GlobalthisThing.addAdmin(name, socket);
                        GlobalthisThing.setAdminEvents(name, socket, io);
                        socket.emit('identAsAdmin', {
                            "name": name,
                            'ident': 'ADMIN'
                        });
                        console.log(Server_settings.preTagServer + " Client " + socket.id + " ACCESS GRANTED(Password in Slide)");
                    } else {
                        socket.emit('identAsAdmin', {
                            "name": name,
                            'ident': 'USER',
                            'error': 'passwordNotMatching'
                        });
                        console.log(Server_settings.preTagServer + " Client  " + socket.id + ' ACCESS DENIED(Password not matching)');
                    }
                } else {
                    socket.emit('identAsAdmin', {
                        "name": name,
                        'ident': 'USER',
                        'error': 'noPasswordtag'
                    });
                    console.log(Server_settings.preTagServer + " Client  " + socket.id + ' ACCESS DENIED(no Password tag found)');
                }
            }else {
                    socket.emit('identAsAdmin', {
                        "name": name,
                        'ident': 'USER',
                        'error': 'ConnectionError'
                    });
                    console.log(Server_settings.preTagServer + " Client  " + socket.id + ' ACCESS DENIED(host unavailable)');
                }

        });
    } catch (err) {
        socket.emit('identAsAdmin', {
            "name": name,
            'ident': 'USER',
            'error': 'GeneralError'
            
        });
        console.log(Server_settings.preTagServer + " Client  " + socket.id + ' ACCESS DENIED');

        console.log(err);
    }
};

this.setPassword = function(data, socket) {
    if (typeof data === 'undefined')
        return;
    if (GlobalthisThing.isAdmin(data.name, socket)) {
        var md5TestString = GlobalthisThing.crypto.createHash('md5').update((' ' + data.password).trim()).digest("hex");
        var md5TestString2 = GlobalthisThing.crypto.createHash('md5').update(md5TestString).digest("hex");
        GlobalthisThing.Presentations[data.name].adminCode = md5TestString2;
        GlobalthisThing.Presentations[data.name].allowAnonymousAuth = false;
        socket.emit('setPassword', {
            "name": data.name,
            "type": 'success'
        });
    } else {
        socket.emit('setPassword', {
            "name": data.name,
            "type": 'failed'
        });
    }
};
/**
 *	Reset the Password of a Presentation
 *	
 *
 */
this.resetPassword = function(data, socket) {
    var tempPW = Server_settings.standardPassword;
    if (Server_settings.standardPassword === false) {
        tempPW = this.crypto.createHash('md5').update((' ' + Math.floor(Math.random() * 4257671236709)).trim()).digest("hex").substr(0, 20);
    }
    if (typeof data === 'undefined')
        return;
    if ((Server_settings.localInstallation)) {

        var md5TestString = GlobalthisThing.crypto.createHash('md5').update((' ' + tempPW).trim()).digest("hex");
        var md5TestString2 = GlobalthisThing.crypto.createHash('md5').update(md5TestString).digest("hex");
        GlobalthisThing.Presentations[data.name].adminCode = md5TestString2;
        GlobalthisThing.Presentations[data.name].allowAnonymousAuth = false;
        GlobalthisThing.savePresData();
        console.log(Server_settings.preTagServerData + ' password reset to: "' + tempPW + '"');
        socket.emit('resetedPassword', {
            "name": data.name,
            "type": 'localReset',
            "new": tempPW
        });
    } else {

        if (typeof nodemailer === 'undefined') {
            var nodemailer = require(Server_settings.NodeMailerPackage);
        }
        if (Server_settings.useMail) {
            var request = require(Server_settings.RequestPackage);
            request(data.name, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    var re = new RegExp(/<link.rel=["']http:\/\/ns.aksw.org\/keynode\/mailto['"].+href=['"]mailto:(.+)['"].+\/>/i),
                            arrMatches = body.match(re);
                    if (arrMatches) {
                        var Mail = arrMatches[1];
                        if (Mail !== '') {

                            var md5TestString = GlobalthisThing.crypto.createHash('md5').update((' ' + tempPW).trim()).digest("hex");
                            var md5TestString2 = GlobalthisThing.crypto.createHash('md5').update(md5TestString).digest("hex");
                            GlobalthisThing.Presentations[data.name].adminCode = md5TestString2;
                            GlobalthisThing.Presentations[data.name].allowAnonymousAuth = false;
                            GlobalthisThing.savePresData();
                            var transport = nodemailer.createTransport(Server_settings.mailProto, Server_settings.smtp_options),
                                    mailOptions = {
                                from: Server_settings.serverName+" <"+Server_settings.smtp_options.auth.user+"> ",
                                to: Mail,
                                subject: "Password reset for your presentation",
                                text:'Hello '+Mail+',\n\r\n\r you have reset your password for : \n\r' + data.name + '\n\rFor Keynode.JS Server: "' + Server_settings.serverName + '"\n\rYour new password is: "' + tempPW + '"\n\r\n\rBest,  ' + Server_settings.serverName + ' '
                            };
                            transport.sendMail(mailOptions);
                            socket.emit('resetedPassword', {
                                "name": data.name,
                                "type": 'mailReset'
                            });
                        } else {
                            socket.emit('resetedPassword', {
                                "name": data.name,
                                "type": 'fail-noMail'
                            });
                        }
                    } else {
                        socket.emit('resetedPassword', {
                            "name": data.name,
                            "type": 'fail-noMail'
                        });
                    }
                }
            });

        }
        socket.emit('resetedPassword', {
        "name": data.name,
        "type": 'failed',
        "message": "Server does not Support Mail-Password-Reset, please use Password in Slide."
    });
    }
};
Array.prototype.contains = function(k) {
    for (var p in this)
        if (this[p] === k)
            return true;
    return false;
};
console.log(Server_settings.preTagInfo + ' Server_Data.js loaded.');
