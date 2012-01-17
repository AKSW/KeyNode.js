console.log('[Info] Server_Data.js loaded.');
this.Presentations=new Object();
this.addPres=function(name){
	this.Presentations[name]=new Pres();
	console.log('[Server_data] New Presentation: '+name);
}
this.addUser2Pres=function(name){
	this.Presentations[name].newListener();
	return true;
}
this.getPres=function(name){
return this.Presentations[name];
}
function Pres(){
	//Listener
	this.anzahlListener=0;
	this.getListener=function(){return this.anzahlListener;}
	this.newListener=function(){this.anzahlListener++; return this.anzahlListener;}
	this.leaveListener=function(){this.anzahlListener--; return this.anzahlListener;}

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
			return this.adminCodes[0];
			} else {
			if(socket.sid==this.admin)
			i=0;
			while(true){
				if(this.adminCodes[i]==null){
					this.adminCodes[i]=(Math.floor(Math.random()*4257671236709));
					return this.adminCodes[0];
					}
				i++;
				}
			
			}
	
	}
	

	
	
	
}