/*
Config-file for Server
 

 */
 /* set Pretags for console logs */
this.preTagInfo='\x1B[32m\x1B[1m[Info]\x1B[0m';
this.preTagSettings='\x1B[32m\x1B[1m[Settings]\x1B[0m';
this.preTagServerData='\x1B[32m\x1B[1m[Server_data]\x1B[0m';
this.preTagServer='\x1B[32m\x1B[1m[Server]\x1B[0m'; 
this.preTagPres='\x1B[32m\x1B[1m[Presentation]\x1B[0m';

this.standardPassword='rootKannAlles';
//this.standardPassword=(Math.floor(Math.random() * 4257671236709));


this.Server_Port = 4123;

this.allow_new_presentations = true;

this.debug = true;

console.log(this.preTagSettings+' Server_settings loaded.');
