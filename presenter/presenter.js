/**
* presenter.js
* MainObject
*
*/
function Presenter(){
	main.addLog('init Presenter-class');

	
	this.CopyPres=function(){
		$('#slide_current').html($('#slideData').html());
		$('#slideData').find('.slide').addClass('slideDataClass');
		$('#slide_current').find('.slide').addClass('slideCurrClass')
		}
	main.addLog('Copy Presenter-Data');
	this.CopyPres();
	
	this.ChangeSlide=function(from,to){
	
	if($.deck('getSlide', to-1)) 
	$('#slide_before')
		.html(' ')
		.append(	
			$.deck('getSlide', to-1)
			.clone()
			)
		.find('slideCurrClass')
		.removeClass('slideCurrClass','deck-previous','deck-next','deck-after','deck-before');
	else $('#slide_before')
		.html(' ')
	if($.deck('getSlide', to+1)) 
	$('#slide_after')
		.html(' ')
		.append(
			$.deck('getSlide', to+1)
			.clone()
		)
		.find('slideCurrClass')
		.removeClass('slideCurrClass','deck-previous','deck-next','deck-after','deck-before');
	else $('#slide_after')
		.html(' ')
	}
	
	this.AddDeckHandler=function(){
		$(document).bind('deck.change', function(event, from, to) {main.presenter.ChangeSlide(from,to);});
		};
	
	this.startPres=function(){
		$.deck('.slideCurrClass');
		main.presenter.AddDeckHandler();
	}
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


 