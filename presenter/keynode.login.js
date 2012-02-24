
var login={
	timer:null,
	timerTest:function(){
		if(login.timer!=null) 
			clearTimeout(login.timer);
		return true;
	},
	bindTooltips:function(){
		$(".tooltipEnable").tooltip({
			position: "center left",
			offset: [-2, -25],
			effect: "fade",
			events: {
					  def:     "mouseenter mouseover,mouseleave mouseout",
					  input:   "mouseover, mouseout",
					  widget:  "mouseenter mouseover,mouseleave mouseout",
					},
			opacity: 0.7
			});
	
	},
	init:function(){
		KeyNode.loadCSS('login');
		var contentData={'title':'KeyNode.JS – Presenter'};
		KeyNode.loadTmpl('login',contentData);
		login.bindCanoUrl();
		},
	
	bindCanoUrl:function(){
		if(!$('#CanonicalURL')[0]&&login.timerTest()) 
			login.timer=setTimeout(login.bindCanoUrl,100);
		else {
			login.bindTooltips();
			$('#CanonicalURLsubmit').unbind('click').click(login.testCanoURL);
			$('#CanonicalURLinput').unbind('keydown').keydown(function(e){if(e.keyCode==13)login.testCanoURL();});
		}
		},
	testCanoURL:function(){
		login.startWorking();
		login.nodeServer=new Array();
		$("#NodeServerURLsaved ").hide();
		$("#NodeServerURL .myURLInput ").show();
		$("#NodeServerURL .myButton").show();
		var cano=$('#CanonicalURLinput');
		$('body').append('<div id="temper" style="display:none;"></div>');
		$('#temper').load(cano.val()+" link[rel*='http://ns.aksw.org/keynode/']",function(response, status, xhr){
			if (status == "error") {
				$('.errorMessage').remove();
				$('#presentationURLinput')
				.before('<div class="errorMessage">Can not find your presentation at the canonical url</div>')
				.attr('placeholder','Type the URL of your presentation here')
			}else {
				//$('#presentationURLinput')
				//.attr('value',$("#temper link[rel='http://ns.aksw.org/keynode/canocical']").attr("href"))
				login.addNodeServer($("#temper link[rel='http://ns.aksw.org/keynode/server']").attr("href"));
				}
			/*show  Password things*/
			
			if(typeof($("#temper link[rel='http://ns.aksw.org/keynode/mailto']")[0])=='undefined') {
				$('.myResetButton')
				.attr('disabled', 'disabled')
				.attr('title',"You have to put your mailadress to this for resetting your password")
				.addClass('tooltipEnable')
				login.bindTooltips();
				}else{
				$('.myResetButton')
				.removeAttr('disabled', 'disabled')
				.attr('title',"with this u can reset your password")
				.addClass('tooltipEnable')
				login.bindTooltips();
				
				
				}
		
			$('#presenterStartButton')
					.unbind('click')
					.click(login.submitToServer)
					.fadeIn('slow');
			
			/*show  NodeServerURL things*/
			$('#NodeServerURL').find('#NodeURLinput').unbind('keydown').keydown(function(e){
				if(e.keyCode==13){
				var path=$(this).val()
				login.addNodeServer(path);
				}
				})
			.parent().find('#NodeURLsubmit').unbind('click').click(function(){
				var path=$(this).parent().find('#NodeURLinput').val()		
				login.addNodeServer(path);
				})
			.parent()
			.fadeIn('slow');
			/*show  presentationURL things*/
			$('#presentationURL').fadeIn('slow');
			login.finishWorking();
			});
		}, 
	submitToServer:function(){
	login.startWorking();
	var i=0;
	$('#CanonicalURLinput').attr('disabled', 'disabled');
	$('#CanonicalURLsubmit').fadeOut('fast');
	login.canoURL=$('#CanonicalURLinput').val();
	login.presURL=$('#presentationURL').val()!=''?$('#presentationURL').val():$('#CanonicalURLinput').val();

		//mache server[] bekannt
		mysocket.setValues(login.nodeServer);	
		//test4 serversocketIO
		mysocket.getSocketIO(
		function(){
			
			//set 4 admin --> ident@all servers mysocket.ident
			mysocket.connect2Server(function(){});
			login.finishWorking();
			});
		

	
		},
	startWorking:function(){
	var bg=$('#LoadingBG');
	var load=$('#LoadingContainer');
	if(bg[0]&&load[0]) {
	bg.fadeIn('fast');
	load.fadeIn('fast');
	}
	
	},
	finishWorking:function(){
	var bg=$('#LoadingBG');
	var load=$('#LoadingContainer');
	if(bg[0]&&load[0]) {
		bg.fadeOut('fast');
		load.fadeOut('fast');
		}
	},
	addNodeServer:function(path){
	var anzahl=login.nodeServer.length;
	login.nodeServer[login.nodeServer.length]=path;
	$('body>#NodeServerURLsaved').clone().appendTo('#NodeServerURL').find('#serverValue')
	.html(path).parent().find('.myRemButton').unbind('click')
	.click(login.removeNodeServer)
	.parent()
	.fadeIn('slow')
	.find('#Password')
	.fadeIn('fast')
	.unbind('keydown')
	.keydown(function(e){
				if(e.keyCode==13) login.submitToServer();});
	
	login.bindTooltips();
	},
	removeNodeServer:function(){
	$(this).parent().fadeOut('fast');
	var t=$(this).parent().find('#serverValue').html();
	for(k in login.nodeServer){
		if(login.nodeServer[k]==t) {login.nodeServer.splice(k,1);break; }
	}
	
	},
	nodeServer:new Array(),
	canoURL:null,
	presURL:null,
	serverPass:null
}

login.init();
