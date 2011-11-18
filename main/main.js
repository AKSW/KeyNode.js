
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
		
	},
	singleDeck:function(){
	this.watch = window.open('./watch/index.html', "watch", "status=0,scrollbars=0,fullscreen=1");
	this.watch.focus();	
	
	}



}

$(document).ready(main.init);