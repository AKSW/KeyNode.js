this.Presentations = null;
var GlobalthisThing = this;
var writeLock = false;
var Server_settings = require('./keynode.js.server_settings' );

this.FHandler = require(Server_settings.fsPackage || "fs");
this.crypto = require(Server_settings.cryptoPackage || "crypto");
/**
 * init the Presentations object
 *
 */
this.initPres = function () {
    this.Presentations = {};
};
/**
 * scans for local Presentations and create Json-File
 *
 */
this.createLocalPresFile = function () {
    if(Server_settings.debug) console.log(Server_settings.preTagServerData + ' Try to list local presentations.');
    var foldes=GlobalthisThing.FHandler.readdirSync(Server_settings.webRoot);
    if(!foldes.contains(Server_settings.presentationFolders)) {
        console.log(Server_settings.preTagServerData + ' Error: no presentationfolder found. Try to create it.');
        GlobalthisThing.FHandler.mkdirSync(Server_settings.webRoot+"/"+Server_settings.presentationFolders);
        var foldes=GlobalthisThing.FHandler.readdirSync(Server_settings.webRoot);
        if(!foldes.contains(Server_settings.presentationFolders)) {
            console.log(Server_settings.preTagServerData + 'Error: Can not create folder. Please create "'+Server_settings.presentationFolders+'"-folder in webroot.');
        }
    }
    var presFolders=GlobalthisThing.FHandler.readdirSync(Server_settings.webRoot+"/"+Server_settings.presentationFolders);
     for(var p in presFolders)
        presFolders[p] = "/"+Server_settings.presentationFolders+"/"+presFolders[p];
            
    var str = JSON.stringify(presFolders);
    this.FHandler.writeFile(Server_settings.webRoot+'/presentations.json', String(str), function (err) {
        if (err) {
            console.log(Server_settings.preTagServerData + ' error saving "presentations.json" .');
            return false;
        } else {
            if(Server_settings.debug) console.log(Server_settings.preTagServerData + ' "presentations.json" saved!');
            return true;
        }
    });
    
};

/**
 * add new Pres to The Presentations object
 *
 */
this.addPres = function (name , password) {
    if (typeof password === typeof undefined) password=null;
    if (this.Presentations === null) {
        this.loadPresData();
    }
    if (typeof this.Presentations[name] === 'undefined') {
        this.Presentations[name] = {};
    }
    this.initAdmin(name);
    this.initAdminCodes(name);
    this.setSlideNumber(name,0);
    if(password!==null) this.setPassword(password);
    GlobalthisThing.savePresData();
    console.log(Server_settings.preTagServerData + ' New Presentation: ' + name);
};

/**
 * save the Presentation data to file
 *
 */
this.savePresData = function () {
    if(GlobalthisThing.writeLock){
        setTimeout(GlobalthisThing.savePresData,500);
        return false;
    }
    GlobalthisThing.writeLock=true;
    var str = JSON.stringify(GlobalthisThing.Presentations);
    if(typeof str === typeof undefined) {
        GlobalthisThing.writeLock=false;
        setTimeout(GlobalthisThing.savePresData,500);
        return false;
    }
    GlobalthisThing.FHandler.writeFile('./serverData.save', String(str), function (err) {
        if (err) {
            console.log(Server_settings.preTagServerData + ' error when saving the presentation data.');
            GlobalthisThing.writeLock=false;
            return false;
        } else {
            if(Server_settings.debug) console.log(Server_settings.preTagServerData + ' presentation data saved!');
            GlobalthisThing.writeLock=false;
            return true;
        }
    });
};
/**
 * load Presentation data from file
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
                for(var canoURL in GlobalthisThing.Presentations) {
                    GlobalthisThing.Presentations[canoURL].admin=[];
                    GlobalthisThing.Presentations[canoURL].presenterOnline=false;
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
this.getPres = function (name) {
    if (this.Presentations === null) {
        return null;
    } else {
        return this.Presentations[name];
    }
};
this.setSlideNumber = function (name,slide) {
    this.Presentations[name].slide=slide;
    GlobalthisThing.savePresData();
};
this.getSlideNumber = function (name) {
    return this.Presentations[name].slide;
};

//Admins
/**
 * Init the list of admins
 *
 */
this.initAdmin = function (name) {
    this.Presentations[name].admin = [];
    this.Presentations[name].presenterOnline=false;
    this.Presentations[name].allowAnonymousAuth=true;
    GlobalthisThing.savePresData();
    return true;
};
/**
 * Did the presentation allow Anonymous Auth?
 *
 */
this.allowAnonymousAuth = function (name) {
    return this.Presentations[name].allowAnonymousAuth ;
};
/**
 * Did the presentation have a registered admin?
 *
 */
this.hasAdmin = function (name) {
    return this.Presentations[name].admin === [] ? false : true;
};
/**
 * add admin
 *
 */
this.addAdmin = function (name,socket) {
    this.Presentations[name].admin.push(socket.id);
    GlobalthisThing.savePresData();
    
};
/**
 * remove admin
 *
 */
this.removeAdmin = function (name,socket) {
    var index = this.Presentations[name].admin.indexOf(socket.id);
    if (index > -1) {
        this.Presentations[name].admin.splice(index, 1);
        GlobalthisThing.savePresData();
        return true;
    }
    return false;
};
/**
 * Get the registered admins
 *
 */
this.getAdmins = function (name) {
    if (this.Presentations[name].admin !== []) {
        return this.Presentations[name].admin;
    } else {
        return "getTESTERAdminCode";
    }
};
/**
 * tests if socket.id is admin
 *
 */
this.isAdmin = function (name,socket) {
   if(this.allowAnonymousAuth(name)) return true; 
   for(var admin1 in this.Presentations[name].admin) {
        if(this.Presentations[name].admin[admin1] === socket.id)
            return true;
    }
    return false;
};
/**
 * Get the canonical URL of the presentation that's presenter
 * socket ID is `socketId`.
 */
this.getCanoURLByAdminSocketId = function (socketId) {
    for(var canoURL in this.Presentations) {
        for(var admin in this.Presentations[canoURL].admin) {
            if(this.Presentations[canoURL].admin[admin] === socketId)
                return canoURL;
        }
    }
    return null;
};
/**
 * Init the list of AdminCodes
 *
 */
this.initAdminCodes = function (name) {
    this.Presentations[name].adminCodes = [];
};

this.setAdminEvents = function (name,socket,io) {
    var thisThing=this;
    if(thisThing.getAdmins(name).length>0)
        thisThing.Presentations[name].presenterOnline=true;
    io.sockets
        .in(name)
        .emit('presenterOnline');
    var slide =thisThing.getSlideNumber(name);
    io.sockets
        .in(name)
        .emit('GoTo',slide);
    socket.emit('notes',thisThing.getNotes(name));
    
    socket.on('setNotes', function (data) {
        
        thisThing.setNotes(name,data);
        
    });
    
    socket.on('disconnect', function () {
        thisThing.removeAdmin(name,socket);
        if(thisThing.getAdmins(name).length<=0){
            io.sockets
                .in(name)
                .emit('presenterOffline');
            thisThing.Presentations[name].presenterOnline=false;
        }
            
        
        
    });
};

/**
 * Identify the user as admin by testing the AdminCode
 *
 */
this.setAdminByKey = function (name, key, socket,io) {
    if ((Server_settings.allowAnonymousAuth)&&(key===null)&& GlobalthisThing.allowAnonymousAuth(name)) {
        GlobalthisThing.addAdmin(name,socket);
        GlobalthisThing.setAdminEvents(name,socket,io);
        GlobalthisThing.savePresData();
            socket.emit('identAsAdmin', {
                "name" : name,
                'ident' : 'ANONYM'
            });
        console.log(Server_settings.preTagServer + " Client " + socket.id + " ACCESS GRANTED");
        return true;
    }
    if(typeof key === typeof undefined) key="";
    var i = 0;
    //sendKey
    var md5TestString=this.crypto.createHash('md5').update(key).digest("hex");
    var md5TestString_send=this.crypto.createHash('md5').update(md5TestString).digest("hex");
    if ( GlobalthisThing.Presentations[name].adminCode === md5TestString_send) {

        GlobalthisThing.savePresData();
        socket.emit('identAsAdmin', {
            "name" : name,
            'ident' : 'ADMIN'
        });

        console.log(Server_settings.preTagServer + " Client " + socket.id + " ACCESS GRANTED");

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
                    if(arrMatches2[1]===md5TestString_send)
                    {
                        GlobalthisThing.Presentations[name].admin = socket.id;
                        GlobalthisThing.savePresData();
                        socket.emit('identAsAdmin', {
                            "name" : name,
                            'ident' : 'ADMIN'
                        });
                        GlobalthisThing.setAdminEvents(name,socket,io);    
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
            
        console.log(err); 
    }
};

this.setPassword = function (data,socket) {
    if(typeof data === 'undefined') return;
    if(GlobalthisThing.isAdmin(data.name,socket)){
        var md5TestString=this.crypto.createHash('md5').update((' ' + data.password).trim()).digest("hex");
        var md5TestString2=this.crypto.createHash('md5').update(md5TestString).digest("hex");
        GlobalthisThing.Presentations[data.name].adminCode = md5TestString2;
        GlobalthisThing.Presentations[data.name].allowAnonymousAuth = false;
    }
}
/**
 *	Reset the Password of a Presentation
 *	
 *
 */
this.resetPassword = function (data,socket) {
    if(typeof data === 'undefined') return;
    if ((Server_settings.localInstallation)) {
        var tempPW= Server_settings.standardPassword;
        var md5TestString=this.crypto.createHash('md5').update((' ' + tempPW).trim()).digest("hex");
        var md5TestString2=this.crypto.createHash('md5').update(md5TestString).digest("hex");
        GlobalthisThing.Presentations[data.name].adminCode = md5TestString2;
        GlobalthisThing.savePresData();
        console.log(Server_settings.preTagServerData + ' password reset to: "' + tempPW + '"');
        socket.emit('resetedPassword', {
            "name" : data.name,
            "type" : 'localReset',
            "new"  : tempPW
        });
    } else {
		
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
                            var tempPW= Server_settings.standardPassword;
                            var md5TestString=this.crypto.createHash('md5').update((' ' + tempPW).trim()).digest("hex");
                            var md5TestString2=this.crypto.createHash('md5').update(md5TestString).digest("hex");
                            GlobalthisThing.Presentations[data.name].adminCode = md5TestString2;
                            GlobalthisThing.savePresData();
                            var transport = nodemailer.createTransport(Server_settings.mailProto, Server_settings.smtp_options),
                            mailOptions = {
                                from: "passwordreset@KeyNodeServer.com",
                                to: Mail,
                                subject: "Password reset for your presentation",
                                text: "You have reset your password for : \n\r" + data.name + '\n\rYour new password: ' + tempPW + '\n\r\n\rYour NodeServer'
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
};
Array.prototype.contains = function(k) {
    for(var p in this)
        if(this[p] === k)
            return true;
    return false;
};
console.log(Server_settings.preTagInfo + ' Server_Data.js loaded.');
