
var KeyNode={
	init:function( folder ){
		KeyNode.TemplateFolder=(typeof(folder)=='undefined')?'default':folder;
		KeyNode.loadCSS('parent');
		KeyNode.loadJS('keynode.login');
		
	
	},
	loadCSS:function(path){
		$('head').append('<link rel="stylesheet" href="'+'./Template/'+KeyNode.TemplateFolder+'/'+path+'.css" />')
		//$.getScript(path);
	},
	loadTmpl:function(path,filldata){
	$.get('./Template/'+KeyNode.TemplateFolder+'/'+path+'.tpl', function(data) {
	$('body').append(data);
	for( var k in filldata ) {
	$('body').find('#'+k).html(filldata[k]);
	}
	})
		
	},
	loadJS:function(path){
		$.getScript('./'+path+'.js');
	},
	TemplateFolder:null
}

var mysocket = {
		NodeServer:null,
		socket:null,
		myTimer:null,
		s:null,
		LastTry:2,
		test4SocketIO :function (){
			return (typeof(io)=='undefined')? false : true;
		},
		mySuccess:function(callback){ 
			alert('ready');
		if (mysocket.myTimer==null) return true;
		else {
			window.clearTimeout(mysocket.myTimer);
			console.log('Retry canceled.(Socket.io loaded)');
			
			
			callback();
			return true;
		}
		
		},
		connect2Server:function(callback){
		if(mysocket.s==null) mysocket.s=new Array();
		$('#NodeServerURL').find('#NodeURLinput').hide('fast').parent().find('#NodeURLsubmit').hide('fast');
		$('#NodeServerURL').find('#NodeServerURLsaved').each(function(){
		if(!$(this).is(':visible'))$(this).remove();
		})
		for(i in mysocket.NodeServer){
		if(mysocket.test4SocketIO()) {
			mysocket.s[i] = io.connect(mysocket.NodeServer[i]); 
			mysocket.bindSocketEvents(i);
			}
		}
		
		
		callback();
		},
		oNidentAsAdmin:function(data,globThis){
					if (data.ident == "ADMIN") {
						globThis.find('.errorMessage').remove();
						//alert('Erfolgreich identifiziert als Admin! ;)');
						globThis.css({'background-color':'rgba(0,255,0,0.3)'});
						console.log('U R Admin of ' + data.name + '.');
						
					//	presenter.initPresenterConsole();
						//TODO: Init Konsole
						//TODO: broadcast Zustände
					}else if (data.ident == "USER") {
					globThis.find('.errorMessage').remove();
					globThis
					.css({'background-color':'rgba(255,0,0,0.3)'})
					.append('<div class="errorMessage">Password Wrong?</div>');
					}
					
				
		mysocket.test4ready();
		},
		startPresenter:function(){
		
		KeyNode.loadCSS('presenter');
		KeyNode.loadJS('keynode.presenter');
		
		
		
		},
		readypres:null,
		test4ready:function(){
		var ready=0;
		var all=mysocket.readypres.length;
		for(i in mysocket.readypres) if(mysocket.readypres[i]==1)ready++;
		
		 
		if(ready>0){//mindestens 1mal ready
			if(ready==all){
				$('#presenterStartButton2').remove();
				$('#presenterStartButton')
				.css({'width':'100%'})
				.unbind('click').click(mysocket.startPresenter);
				$('#presenterStartButton').attr('value','start Presenter')
				$('#presenterStartButton2').remove();
			}else{
				if(!$('#presenterStartButton2')[0])
				{
					$('#presenterStartButton')
					.after('<input id="presenterStartButton2"  class="tooltipEnable" type="button" value="Test Inputs" class="tooltipEnable" title="Start the presenter" > ')
					.find('#presenterStartButton2')
					.css({'width':'50%'})
					.unbind('click').click(mysocket.ident)
					}
				else{
					$('#presenterStartButton2')
					.css({'width':'50%'})
					.unbind('click').click(mysocket.ident)
					}
					
				$('#presenterStartButton')
				.css({'width':'50%'})
				.unbind('click').click(mysocket.startPresenter);		
				$('#presenterStartButton').attr('value','start Presenter')	
				}
		}else {//kein server ready
			$('#presenterStartButton2').remove()
			$('#presenterStartButton')
			.css({'width':'100%'}).unbind('click').click(mysocket.ident);
			$('#presenterStartButton').attr('value','retest Inputs')
			}
		
		
		},
		ident:function(){
		
		$('#NodeServerURL').find('#NodeServerURLsaved').each(function(){
			var t=0
			//ident fuer jeden server
			var globThis=$(this);
			var pw=$(this).find('#Passwordinput').val();
			var server=$(this).find('#serverValue').html();
			if(mysocket.test4SocketIO()) {
				for(i in mysocket.NodeServer){ if(mysocket.NodeServer[i]==server) t=i;}
				if(mysocket.readypres==null){
				mysocket.readypres=new Array();
				mysocket.readypres[t]=0;
				}else mysocket.readypres[t]=0;
				
				mysocket.s[t].emit('SetAdmin', {
				"admin" : pw,
				"name" : login.canoURL});
				mysocket.s[t].removeAllListeners('identAsAdmin');
				mysocket.s[t].on('identAsAdmin',function(data){
				if(data.ident=='ADMIN')mysocket.readypres[t]=1;
				mysocket.oNidentAsAdmin(data,globThis);} );
			}
			
			})
		mysocket.test4ready();
		
		},
		oNReady:function(i){
					console.log('Connected to ' + mysocket.NodeServer[i] + '.');
					$('#NodeServerURL').find('.myRemButton').parent().each(function(){
					if($(this).find('#serverValue').html()==mysocket.NodeServer[i]) $(this).css({'background-color':'rgba(255,255,0,0.3)'});})
					if(i==($('#NodeServerURL').find('.myRemButton').parent().length-1))mysocket.ident();
		
		},
		oNconnect:function(i){
				mysocket.s[i].emit('ConnectToPres', login.canoURL);
				mysocket.s[i].removeAllListeners('Ready');
				mysocket.s[i].on('Ready',mysocket.oNReady(i));
		},
		bindSocketEvents:function(i){
			console.log('try2connect to '+ mysocket.NodeServer[i] + '.');	
			mysocket.s[i].removeAllListeners('connect');
			mysocket.s[i].on('connect', mysocket.oNconnect(i));
		
		
		},
		getSocketIO:function(i,callback){
			
			if((typeof(i)=='undefinded')){callback=function(){}; i=0;}
			if((typeof(i)=='function') ){callback=i; i=0;}
			
			if(!mysocket.test4SocketIO()){
				console.log('Socket.IO not found(try to get it from Server '+i+').');
			//	alert('Testserver: '+mysocket.NodeServer[i]);
			jQuery.getScript(
				(mysocket.NodeServer[i]+'/socket.io/socket.io.js'),
				function(data, textStatus, jqxhr) {
					if((jqxhr.status>= 200 && jqxhr.status< 300 || jqxhr.status === 304)) {
						callback();
						} 
					else {
						i++;
						if(i<mysocket.NodeServer.length) 
							mysocket.getSocketIO(i,callback); 
						else {
							console.log('Retry in '+mysocket.LastTry+' sec');
							mysocket.myTimer=window.setTimeout(function(){mysocket.getSocketIO(0,callback);},mysocket.LastTry*1000);
							mysocket.LastTry=mysocket.LastTry*2;
							}
						}
					
					   });
				
			}
			},
		setValues:function(server){
			mysocket.NodeServer=server;
			}
	
	};