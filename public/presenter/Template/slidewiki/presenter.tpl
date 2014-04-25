<!--
        Copyright (C) 2011 Alrik Hausdorf

        This file is part of KeyNode.JS.

        KeyNode.JS is free software: you can redistribute it and/or modify
        it under the terms of the GNU General Public License as published by
        the Free Software Foundation, either version 3 of the License, or
        (at your option) any later version.

        KeyNode.JS is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
        GNU General Public License for more details.

        You should have received a copy of the GNU General Public License
        along with KeyNode.JS.  If not, see <http://www.gnu.org/licenses/>.
-->
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

            <div class="col-sm-12 hidden-xs" style="">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title clearfix">notes
                            <div class="pull-right">
                                <button class="btn btn-xs" style="margin-top: -4px;margin-bottom: -3px; visibility: hidden;">save</button>
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

    <div class="row" style="padding: 15px;" id="buttonWrapper">
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
    $("#buttonWrapper").delegate("#nextBTN", "click", function() {
        try {
            presenter.Next();
        } catch (e) {
        }
        ;
        return false;
    });
    $("#buttonWrapper").delegate("#nextBTN", "tap", function() {
        try {
            presenter.Next();
        } catch (e) {
        }
        ;
        return false;
    });
    $("#buttonWrapper").delegate("#prevBTN", "click", function() {
        try {
            presenter.Prev();
        } catch (e) {
        }
        ;
        return false;
    });
    $("#buttonWrapper").delegate("#prevBTN", "tap", function() {
        try {
            presenter.Prev();
        } catch (e) {
        }
        ;
        return false;
    });

</script>