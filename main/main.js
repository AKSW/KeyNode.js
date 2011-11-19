
var main={
	/**
	* Presenter/watch Fenster Call
	*
	*/
	presenter:null,
	watch:null,
	/**
	* Init of the Main-Class
	*
	*/
	init:function(){
		main.addLog('Init Main.');
		main.loadPresenter();
		main.loadHandler();
	},
	addLog:function(message){
		var d=new Date();
		$('#Main').append("<div class='LogEntry'>["+d.getDate()+"."+d.getMonth()+"."+d.getFullYear()+"."+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"]: "+message+" </div>");
	},
	addError:function(message){
		var d=new Date();
		$('#Main').append("<div class='LogEntry Error'>["+d.getDate()+"."+d.getMonth()+"."+d.getFullYear()+"."+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"]: "+message+" </div>");
	},
	loadPresenter:function(){
		this.presenter=new Presenter();
	
	},
	loadHandler:function(){
	$('#switchDisplay').unbind('click').click(function(){
		if($(this).html().trim()=="Show Presenter") {
			main.presenter.ShowPresenter();
			$(this).html('Show Main');
			}else{
			main.presenter.HidePresenter();
			$(this).html('Show Presenter');
			
			}
	})
	
	}
	

}

$(document).ready(main.init);