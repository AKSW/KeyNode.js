
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
		$('#singleDeck').click(function(){main.singleDeck();});
		$('#OpenPresenter').click(function(){main.OpenPresenter();});
	},
	OpenDeck:function(){
	this.watch = window.open('./watch/index.html', "watch", "status=0,scrollbars=0,fullscreen=1");
	this.watch.focus();	
	
	},
	OpenPresenter:function(){
	this.presenter = window.open('./presenter/index.html', "presenter", "status=0,scrollbars=0,fullscreen=1");
	this.presenter.focus();	
	
	}


}

$(document).ready(main.init);