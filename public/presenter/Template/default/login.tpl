<div class="container">
    <div class="col-sm-10 col-sm-offset-1 col-xs-12">
        <div class="row">
            <h2 id="title">
                KeyNode.JS
                <small>Synchronize presentations everywhere.</small>
            </h2>  
        </div>
        <div class="row">
            <div class="panel-group" id="blocks">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <a data-toggle="collapse" data-parent="#blocks" href="#easyForm">
                        <h4 class="panel-title">
                            
                                Start easy
                        </h4>
                            </a>
                    </div>
                    <div id="easyForm" class="panel-collapse collapse in">
                        <div class="panel-body">
                            <!-- <EasyForm> -->
                            <form role="form">
                                <div class="form-group col-md-6">
                                    <label for="urlInput">Just type a new URL</label>
                                    <input id="easyurl" type="text" id="urlInput" class="form-control" placeholder="a URL">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="urlSelect">or select one of these</label>
                                    <select id="easyselect" class="form-control">
                                        <option>--loading--</option>
                                    </select>
                                </div>
                                <div class="form-group col-xs-12">
                                    <a class="btn btn-default col-xs-12" id="easysubmit">to the next step</a>
                                </div>    
                            </form>
                            <!-- </EasyForm> -->
                        </div>
                    </div>
                </div>
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <a data-toggle="collapse" data-parent="#blocks" href="#advancedForm">
                            <h4 class="panel-title">
                                advanced settings 
                            </h4>
                        </a>
                    </div>
                    <div id="advancedForm" class="panel-collapse collapse">
                        <div class="panel-body">
                            <!-- <AdvancedForm> -->
                            <form class="form-horizontal" role="form" onsubmit="return false;">
                                <div class="form-group">
                                    <label for="inputCanonicalUrl" class="col-md-3 control-label">Canonical URL</label>
                                    <div class="col-md-9">
                                        <div class="input-group">
                                            <span class="input-group-addon">http://</span>
                                            
                                            
                                            <input  type="text" 
                                                    class="form-control" 
                                                    id="inputCanonicalUrl" 
                                                    placeholder="url/to/deck.js"
                                                    data-toggle="tooltip" 
                                                    data-container="body" 
                                                    title="This URL is used to identify your Deck on the KeyNode.JS server. It should be an URL where the presentation is always available.">
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="inputDeckUrl" class="col-md-3 control-label">Presentation URL</label>
                                    <div class="col-md-9">
                                        <div class="input-group">
                                            <span class="input-group-addon">http://</span>
                                            <input  type="text" 
                                                    class="form-control" 
                                                    id="inputDeckUrl" 
                                                    placeholder="localurl/to/deck.js"
                                                    data-toggle="tooltip" 
                                                    data-container="body" 
                                            title="This URL is used by the presenter. It is recommenced to use an local instance of your presentation.">
                                                
                                        </div>
                                    </div>
                                </div>
                                <div class="panel panel-default" style="margin-bottom: 15px;">
                                    <div class="panel-heading"
                                         data-toggle="tooltip" 
                                         data-container="body" 
                                         title="To broadcast your presentations you need at least one. It is recommenced to have one local and one on the Web.">Keynode.JS Server</div>
                                    <div class="panel-body" id="NodeServer">
                                        <!-- <addNewServer> -->
                                        <div class="form-group">
                                            <div class="col-md-12">
                                                <div class="input-group"
                                                     data-toggle="tooltip" 
                                                     data-container="body" 
                                                     title="add an custom server">
                                                    <span class="input-group-addon">http://</span>
                                                    <input type="text" class="form-control">
                                                    <span class="input-group-btn">
                                                        <button class="btn btn-default" type="button">add</button>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- </addNewServer> -->
                                        <hr>
                                        
                                        <!-- <Server> -->
                                            
                                        <div class="row hidden" id="server_wrapper" >
                                             <div class="col-sm-1 server-status" > 
                                              
                                                     
                                            
                                                
                                            </div>
                                            <div class="col-sm-5">
                                                <div class="input-group">
                                                    <span class="input-group-addon">http://</span>
                                                <input class="serverUrl form-control" type="text" value="server1.org:3214/" >
                                                </div>
                                            </div>
                                            <div class="col-sm-4">
                                                <div class=" input-group">
                                                    <input class="passwordInput form-control" type="password" value="password" placeholder="please insert password here">
                                                    <span class="input-group-addon"
                                                          data-toggle="tooltip" 
                                                          data-container="body" 
                                                          title="Display Password">
                                                        <input class="displayPassword"
                                                               type="checkbox">
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="col-sm-2"> 
                                                
                                                <div class="btn-group dropup">
                                                    <button type="button" class="removeServer btn btn-default"
                                                            data-toggle="tooltip" 
                                                            data-container="body" 
                                                            title="Remove server"><i class="glyphicon glyphicon-trash"></i></button>
                                                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                                        <span class="caret"></span>
                                                        <span class="sr-only">Toggle Dropdown</span>
                                                    </button>
                                                    <ul class="dropdown-menu" role="menu">
                                                        <li><a href="#" class="getNewPassword">Reset password</a></li>
                                                        <li><a href="#" class="setPassword">Set new password</a></li>    
                                                        <li><a href="#" class="retestPassword">Retest password</a></li>       
                                                    </ul>
                                                </div>
                                                    
                                                    
                                            </div>
                                        </div>
          
                                        <!-- </Server> -->
                                    </div>
                                </div>
                                <button class="form-control btn btn-default" id="advancedsubmit">start presentation</button>
                            </form>
                            <!-- </AdvancedForm> -->                        
                        </div>
                    </div>
                </div>
                
            </div>
            
            
            
            
        </div>
    </div>
    
</div>

<div class="navbar navbar-fixed-bottom navbar-default">
    <div class="navbar-left">
        <div class=" navbar-text ">
            <a href="https://github.com/AKSW/KeyNode.js/wiki" class="hidden-xs" target="newTab">Dokumentation of Keynode.JS @ GitHub</a>
        </div>
    </div>
    <div class="navbar-right">
        <div class="navbar-text" 
             data-toggle="tooltip"
             data-direction="top"
             data-container="body" 
             title="Written by Alrik Hausdorf">
            KeyNode.JS &copy; <a href="http://aksw.org/Projects/KeynodeJS" >AKSW.org</a>
        </div>
    </div>
    
</div>

<script>
    KeyNode.loadJS('Template/default/Bootstrap/bootstrap.min',function(){
        $("[data-toggle='tooltip']").tooltip();
        
        $.getJSON( "/presentations.json").done(function(data) {
            if(data.length===0)
                        $('#easyselect').html("<option>--no local presentations--</option>");

            $('#easyselect').html("<option>--nothing selected--</option>");

            for(element in data)
                $('#easyselect').append("<option>"+data[element]+"</option>");
        }).fail(function() {
            $('#easyselect').html("<option>--loading failed--</option>");
        });
        
        $( "#NodeServer" ).delegate( ".removeServer", "click", function() {
            var ele=$( this ).parents('.server').find(".serverUrl");
            var value= "http://"+ele.val();
            login.advancedForm.removeNodeServer(value);            
        });
        $( "#NodeServer" ).delegate( ".getNewPassword", "click", function() {
            var ele=$( this ).parents('.server').find(".serverUrl");
            var value= "http://"+ele.val(); 
            var setup=$.keynode('getSetup');
            var server=setup.getNodeServer(value);
            server.socket
                .emit('resetPassword',{
                    "name":setup.getCanonicalURL()                
                });
                
        });
        $(document).bind('NodeserverPassReset', function(data1) {
            if(data1.data.type==="mailReset") alert('Reset for Server '+data1.server +'successful.\n Password was send to your Email.')
            else if(data1.data.type==="localReset") alert('Reset for Server '+data1.server +'successful.\n Your new Password is:"'+data.new+'"')
            else if(data1.data.type==="fail-noMail") alert('Reset for Server '+data1.server +'failed.\n There is no mailadress located in the slide.')

        });
        
        $( "#NodeServer" ).delegate( ".displayPassword", "click", function() {
            var ele=$( this ).parent().parent().find("input:first");
            var type= ele.attr( "type" );
            ele.attr( "type" ,type==="password"?"text":"password");
        });
        $(document).bind('SetupEasySubmit', function() {
        
            $('.server').fadeOut().remove();
            $('#inputDeckUrl').attr('value', '');
            $('#inputCanonicalUrl').attr('value', '');
            
            $('#easysubmit').removeAttr('disabled');
            if($('#easyForm').hasClass("in")){
                $('a[href="#advancedForm"]').click();
            };
            $('.removeMe').fadeOut().remove();
            if(!$('a[href="#easyForm"]').find("h4>i.glyphicon-ok")[0])
            $('a[href="#easyForm"]').find("h4").prepend('<i class="glyphicon glyphicon-ok"></i>');
            
        });
        $(document).bind('SetupEasySubmitError', function(e,error) {
            //console.log(error);
            $('#easysubmit').removeAttr('disabled');
            $('.removeMe').fadeOut().remove();
            $('#easyselect').before('<div class="easySelectError alert alert-warning alert-dismissable" >'+
                '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'+
                '<strong>Error!</strong> '+error+
              '</div>');
            $("#easyselect option[value='--nothing selected--']").attr('selected', 'selected');
            window.setTimeout(function(){
                $('.easySelectError').fadeOut('slow').remove();
            },6000);
        });
        $(document).bind('SetupEasySubmitBefore', function(e) {
            $('label[for="urlSelect"]').prepend('<i class="removeMe glyphicon glyphicon-refresh animate"></i> ');
            $('#easysubmit').attr('disabled', 'disabled');
            window.setTimeout(function(){
            $('.easySelectError').fadeOut('slow').remove();
            },6000);
        });    
        $(document).bind('SetupAdvancedCanonicalReady', function(e,value) {
            if(value.indexOf("http://")!==-1)
                value=value.substring(7, value.length);

            $('#inputCanonicalUrl').attr('value', value);
        });    
        $(document).bind('SetupAdvancedPresentationurlReady', function(e,value) {
            if(value.indexOf("http://")!==-1)
                value=value.substring(7, value.length);

            $('#inputDeckUrl').attr('value', value);
        });    
        $(document).bind('SetupAdvancedNodeserverNew', function(e,id) {
            
        
            var setup=$.keynode('getSetup');
            var container=$('#server_wrapper').clone();
            var server=setup.getNodeServer(id);
            //set URL
            var url = server.url;
            if(url.indexOf("http://")!==-1)
                url=url.substring(7, url.length);
            container.attr('id','server_'+id)
                    .removeClass('hidden')
                    .addClass('server')
                    .find('.serverUrl').attr("value",url);
            //set password
            var pw = server.password;
            if(typeof pw === 'undefined')
                container.find('.passwordInput').attr("value",'');
            else 
                container.find('.passwordInput').attr("value",pw); 
            
            
            
            //enable Tooltips
            container.find("[data-toggle='tooltip']").tooltip();
            $('#server_wrapper').parent().append(container);
            
        });  
        $(document).bind('SetupAdvancedNodeserverRemove', function(e,server) {
               
            //set URL
            var url = server;
            
            var wrapper=$('#NodeServer')
                    .find('input[value="'+url.substr(7)+'"]')
                    .parents('.server');
            
                    wrapper.find('.removeServer').tooltip('destroy');
                    wrapper.fadeOut('fast').remove();
                    $('body>.tooltip').remove(); 
            
        });  
        $(document).bind('SetupAdvancedSocketIoError', function(e,server) {
            $('#NodeServer')
                    .parent()
                    .removeClass('panel-default')
                    .removeClass('panel-success')
                    .addClass('panel-warning')
                    .find('.panel-heading')
                    .attr('data-original-title','At least one Server should be available.')
                    .tooltip();
          
        });  
        $(document).bind('NodeserverBinding', function(e,server) {
             $('#NodeServer')
                    .find('input[value="'+server.url.substr(7)+'"]')
                    .parents('.server')
                    .find('.server-status').html('<span class="label label-danger"><i class="glyphicon glyphicon-ban-circle"><i></span>')
                    .attr('data-original-title','Server Offline')
                    .tooltip();
          
        });  
        $(document).bind('SetupAdvancedSocketIoReady', function(e,server) {
            $('#NodeServer')
                    .parent()
                    .removeClass('panel-default')
                    .removeClass('panel-warning')
                    .addClass('panel-success')
                    .find('.panel-heading')
                    .attr('data-original-title','SocketIO lib was loaded from '+server.url)
                    .tooltip();
        });  
        $(document).bind('NodeserverConnected', function(e,server) {
            $('#NodeServer')
                    .find('input[value="'+server.url.substr(7)+'"]')
                    .parents('.server')
                    .find('.server-status').html('<span class="label label-success"><i class="glyphicon glyphicon-link"><i></span>')
                    .attr('data-original-title','connected')
                    .tooltip();
        });  
        $(document).bind('NodeserverDiconnected', function(e,server) {
            $('#NodeServer')
                    .find('input[value="'+server.url.substr(7)+'"]')
                    .parents('.server')
                    .find('.server-status').html('<span class="label label-warning"><i class="glyphicon glyphicon-ban-circle"><i></span>')
                    .attr('data-original-title','disconnected')
                    .tooltip();
        }); 
        $(document).bind('NodeserverIdent', function(e,eventData) {
            var server= eventData.server;
            var data= eventData.data; 
            var serverWrapper = $('#NodeServer')
                .find('input[value="'+server.url.substr(7)+'"]')
                .parents('.server');
            if(data.ident==="ADMIN"){
                serverWrapper.find('.passwordInput')
                        .attr('disabled','disabled')
                        .parents('.input-group')
                        .attr('data-original-title','fully identified')
                        .tooltip();
                serverWrapper.find('.server-status')
                        .html('<span class="label label-success"><i class="glyphicon glyphicon-ok"><i></span>')
                        .attr('data-original-title','fully identified')
                        .tooltip();
            }else if(data.ident==="ANONYM"){
                serverWrapper.find('.server-status')
                        .html('<span class="label label-success"><i class="glyphicon glyphicon-eye-open"><i></span>')
                        .attr('data-original-title','anonym identified')
                        .tooltip();
            
                serverWrapper.find('.input-group')
                        .attr('data-original-title','connected and anonym identified, put right password here to fully authenticate')
                        .tooltip();
            }
        }); 
        $(document).bind('NodeserverReady', function(e,server) {
            $('#NodeServer')
                    .find('input[value="'+server.url.substr(7)+'"]')
                    .parents('.server')
                    .find('.server-status').html('<span class="label label-success"><i class="glyphicon glyphicon-ok-circle"><i></span>')
                    .attr('data-original-title','Connected to Slide')
                    .tooltip();
        });  
        
    });
</script>