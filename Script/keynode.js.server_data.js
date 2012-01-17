console.log('[Info] Server_Data.js loaded.');
this.Presentations=null;
this.FHandler = require('fs');
this.addPres=function(name){
if(this.Presentations==null) this.loadPresData();
	this.Presentations[name]=new Pres();
	console.log('[Server_data] New Presentation: '+name);
}
this.addUser2Pres=function(name){
	this.Presentations[name].newListener();
	return true;
}
this.getPres=function(name){
if(this.Presentations==null) return null; else
return this.Presentations[name];
} 
this.savePresData=function(){
	var str = JSON.stringify(this.Presentations);
	
	this.FHandler.open('ServerData/serverData.save', 'w', 666, function( e, id )
	{
	  this.FHandler.write( id, String(str), null, 'utf8', function(e)
	  {
		this.FHandler.close(id);
		console.log('[Server_data] Presentationsdata erfolgreich gespeichert!');
		return true;
	  });
	});
		

}
this.loadPresData=function(){
	if(this.Presentations==null){
	
	this.FHandler.readFile('ServerData/serverData.save', function (err, data) 
		{
		if(err) {
			this.Presentations = new Object();
			console.log('[Server_data] Presentationsdata erfolgreich neu erstellt!');
			}
			else 
			{
			this.Presentations = JSON.parse(data);
			console.log('[Server_data] Presentationsdata erfolgreich geladen!');
			}
			return true;
			
		});
	
	
	}
	
	}
		


function Pres(){ 
	//Listener
	this.anzahlListener=0;
	this.getListener=function(){return this.anzahlListener;}
	this.newListener=function(){this.anzahlListener++; Server_data.savePresData();return this.anzahlListener;}
	this.leaveListener=function(){this.anzahlListener--; Server_data.savePresData();return this.anzahlListener;}

	//Admins
	this.admin=null;
	this.HasAdmin=function(){return this.admin==null ? false:true;}
	this.getAdmin=function(){
	if(this.admin!=null)
	return this.admin;
	else return "getTESTERAdminCode";
	}
	this.adminCodes=null;
	this.getAdminCode=function(socket){
		if(this.adminCodes==null){
			this.adminCodes=new Array();  
			this.adminCodes[0]=(Math.floor(Math.random()*4257671236709));
			Server_data.savePresData();
			return this.adminCodes[0];
			} else {
			if(socket.sid==this.admin)
			i=0;
			while(true){
				if(this.adminCodes[i]==null){
					this.adminCodes[i]=(Math.floor(Math.random()*4257671236709));
					Server_data.savePresData();
					return this.adminCodes[0];
					}
				i++;
				}
			
			}
	
	}
	

	
	
	
}