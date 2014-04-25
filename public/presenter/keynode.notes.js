/* 
 *  This file is part of KeyNode.JS.
 * 
 *  KeyNode.JS is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  KeyNode.JS is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with KeyNode.JS.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */
/**
 * Notes Extension for Presenter
 * @version 1.0
 * @author Alrik Hausdorf
 */
var NotesDisplay = {
    $events: null,
    $setup: null,
    $container: null,
    $url: null,
    $notes : [],
    init: function() {
        NotesDisplay.$events = $.keynode('getEvents');
        NotesDisplay.$setup = $.keynode('getSetup');
        NotesDisplay.$container = $('#notes');
        NotesDisplay.bindEvent();


    },
    bindEvent: function() {
        console.log(NotesDisplay.$events.presenter.slideChange,"bindEvent");
        $(window).bind(NotesDisplay.$events.presenter.slideChange,function(e,from,to){
           NotesDisplay.$container.html(NotesDisplay.$notes[to]?NotesDisplay.$notes[to]:"");
        });
        var to = NotesDisplay.$setup.getSlideNumber();
        NotesDisplay.$container.html(NotesDisplay.$notes[to]?NotesDisplay.$notes[to]:"fial");
    },
    setUrl: function(url) {
        NotesDisplay.$url =  url;
        $.getJSON(NotesDisplay.$url)
                .done(function(data) {
            if (data.length === 0) {
                NotesDisplay.$notes = [];
            }else{
                NotesDisplay.$notes = data;
            }
             NotesDisplay.init();
        }).fail(function() {
            NotesDisplay.$notes = [];
        });

       



    }
};

