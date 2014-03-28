<div class="container-fluid">
    
     
    <div class="row" style="padding: 15px;" >
        <div class="col-sm-8">
            <div class="panel panel-default">
                <div class="panel-heading"><h3 class="panel-title">current slide</h3></div>
                <div class="panel-body wrapper" >
                    <div id="slide_current" class="main">loading...</div>
                </div>
            </div>
            
        </div>
        <div class="col-sm-4">
            
                <div class="col-sm-12 hidden-xs" style="visibility: hidden;">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="panel-title clearfix">Notes
                                <div class="pull-right">
                                    <button class="btn btn-xs" style="margin-top: -4px;margin-bottom: -3px;">save</button>
                                </div>
                            </h3>
                        </div>
                        <div class="panel-body wrapper" >
                            <textarea id="notes" class="main" style="width: 100%;height: 100%;"></textarea>
                        </div>
                    </div>
                    
                </div>
            
            
                <div class="col-sm-12 hidden-xs">
                    <div class="panel panel-default">
                        <div class="panel-heading"><h3 class="panel-title">next slide</h3></div>
                        <div class="panel-body wrapper" >
                            <div id="slide_after" class="main">loading...</div>
                        </div>
                    </div>
                </div>
            
        </div>
        
    </div>
    
    <div class="row" >
        <div class="hidden-sm hidden-md hidden-lg col-xs-6">
            <div class="panel panel-default">
                <div class="panel-body wrapper" >
                    <div class="main" style="text-align: center;">
                        <a href="#" id="prevBTN" class="btn btn-lg">
                            <i class="glyphicon glyphicon-chevron-left" style="font-size: 7em;"></i>
                        </a>
                    </div>
                </div>
            </div>
            
        </div>
        <div class="hidden-sm hidden-md hidden-lg col-xs-6">
            <div class="panel panel-default">
                <div class="panel-body wrapper" >
                    <div class="main" style="text-align: center;">
                        <a href="#" id="nextBTN" class="btn btn-lg">
                            <i class="glyphicon glyphicon-chevron-right" style="font-size: 7em;"></i>
                        </a>
                    </div>
                </div>
            </div>
            
        </div>
        
    </div>
    
</div>
<div id="slideData"></div> 
<script>
    $( "#NodeServer" ).delegate( "#nextBTN", "click", function() {
            try{
                presenter.Next();
            }catch(e){
            }
        });
    $( "#NodeServer" ).delegate( "#prevBTN", "click", function() {
            try{
                presenter.Prev();
            }catch(e){
            };
        });
    </script>