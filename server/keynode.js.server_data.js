this.Presentations = null;
var GlobalthisThing = this;
var Server_settings = require('./keynode.js.server_settings');
this.FHandler = require('fs');
/**
* init The Presentations object
*
*/
this.initPres = function () {
	this.Presentations = new Object();
}
/**
* add new Pres to The Presentations object
*
*/
this.addPres = function (name) {
	if (this.Presentations == null)
		this.loadPresData();
	if(this.Presentations[name]	== null)	this.Presentations[name]=new Object();
	this.initAdmin(name);
	this.initAdminCodes(name);
	GlobalthisThing.savePresData();
	console.log(Server_settings.preTagServerData+' New Presentation: ' + name);
}
/**
* get the Presentation
*
*/
this.getPres = function (name) {
	if (this.Presentations == null)
		return null;
	else
		return this.Presentations[name];
}
/**
* save the Presentationdata to file
*
*/
this.savePresData = function () {
	var str = JSON.stringify(this.Presentations);
	this.FHandler.writeFile('./serverData.save', String(str), function (err) { {
			if (err)
				return false;
			console.log(Server_settings.preTagServerData+' Presentationsdata erfolgreich gespeichert!');
			return true;
		}
	});
	
}
/**
* load Presentationdata from file
*
*/
this.loadPresData = function () {
	if (this.Presentations == null) {
		this.FHandler.readFile('./serverData.save', function (err, data) {
			if (err) {
				GlobalthisThing.initPres();
				GlobalthisThing.savePresData();
				console.log(Server_settings.preTagServerData+' Presentationsdata erfolgreich neu erstellt!');
			} else {
				GlobalthisThing.Presentations = JSON.parse(data);
				//TODO: Anzahl listener zurücksetzen
				console.log(Server_settings.preTagServerData+' Presentationsdata erfolgreich geladen!');
			}
			return true;
			
		});
		
	}
	
}



//Admins
/**
* Init the List of Admins
*
*/
this.initAdmin = function (name) {
	return this.Presentations[name].admin=null;
}
/**
* Did the Presentation have an registered Admin?
*
*/
this.HasAdmin = function (name) {
	return this.Presentations[name].admin == null ? false : true;
}
/**
* get the Registered Admin
*
*/
this.getAdmin = function (name) {
	if (this.Presentations[name].admin != null)
		return this.Presentations[name].admin;
	else
		return "getTESTERAdminCode";
}
/**
* Init the List of AdminCodes
*
*/
this.initAdminCodes=function(name){
this.Presentations[name].adminCodes = 'rootKannAlles';
}
/**
* Ident the User as Admin by testing the AdminCode
*
*/
this.setAdminByKey=function(name,key,socket){
	var i =0;
	while (true) {
	
		if (this.Presentations[name].adminCodes[i] == key) {
			this.Presentations[name].admin = socket.id;
			GlobalthisThing.savePresData();
			return true;
			}else{
				if(typeof(this.Presentations[name].adminCodes[i]) == undefined)return false;
				i++;
				}
		}
				
}



/**
* get an AdminCode
*
*/
this.getAdminCode = function (socket,name) {
	if (this.Presentations[name].adminCodes == null) {
		this.Presentations[name].adminCodes = new Array();
		this.Presentations[name].adminCodes[0] = (Math.floor(Math.random() * 4257671236709));
		GlobalthisThing.savePresData();
		return this.Presentations[name].adminCodes[0];
	} else {
		if (socket.id == this.Presentations[name].admin){
			i = 0;
			while (true) {
				if (typeof(this.Presentations[name].adminCodes[i]) == undefined) {
					this.Presentations[name].adminCodes[i] = (Math.floor(Math.random() * 4257671236709));
					GlobalthisThing.savePresData();
					return this.Presentations[name].adminCodes[i];
				}
				i++;
			}
		}
	}
	
}
console.log(Server_settings.preTagInfo+' Server_Data.js loaded.');

