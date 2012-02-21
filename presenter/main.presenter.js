
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
	login:null,
	presenter:null,
	TemplateFolder:null
}
