
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
		main.presenter.GetPresenterHTML();
		setTimeout(function(){
		alert($('#temp').contents().find('#center_container').html());
		$('#Logo').hide();
		$('#Main').hide();
		main.presenter.ShowPresenter();},2000);
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
	
	}
	

}

$(document).ready(main.init);