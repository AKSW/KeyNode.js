/**
* presenter.js
* MainObject
*
*/
function Presenter(){
	main.addLog('init Presenter-class');
	this.GetPresenterHTML=function(){
		$.ajax({type: "GET",timeout: 2000,crossDomain:true,url: "presenter/index.html",
		success: function(data) {
			$('#CenterWrapper').find('#FooterWrapper').before(data);
			$('#CenterWrapper').find('#center_container').hide();
			main.addLog('Presenter-HTML loaded.');
			},
		error:function(jqXHR, textStatus, errorThrown){
		main.addError('Error wile trying to load Presenter-HTML-->' + errorThrown)
		main.presenter.GetPresenterHTMLIFrame();
		}
		});
	
	}
	this.GetPresenterHTMLIFrame=function(){
		//$('body').append(' <iframe style="display:none;" id="temp" src="presenter/index.html"></iframe>').find('#temp').contents().find('#center_container').clone().prependTo('#FooterWrapper');
		//main.addLog('Presenter-HTML loaded(iFrame).');
		
	}
	this.ShowPresenter=function(){
	$('#CenterWrapper').animate({'top':'-100%'},200,
		function(){
			$('#MainWrapper').hide();
			$('#PresenterWrapper').show();
		
		}).animate({'top':'0%'},200);

	
	}
	this.HidePresenter=function(){
	$('#CenterWrapper').animate({'top':'-100%'},200,
		function(){
			
			$('#PresenterWrapper').hide();
			$('#MainWrapper').show();
		}).animate({'top':'0%'},200);

	
	}

}


 