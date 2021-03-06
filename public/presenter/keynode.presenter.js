/*
 *  Copyright (C) 2011 Alrik Hausdorf
 *  
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
 * Presenter Class for Presenter
 * @version 1.0
 * @author Alrik Hausdorf <admin@morulia.de>
 */
var presenter = {
    $setup: $.keynode('getSetup'),
    slideNumber: 0,
    diff: -1,
    $socket: $.keynode('getSocketHandler'),
    slideLength: -1,
    Next: function() {
        presenter.slideNumber = presenter.$setup.getSlideNumber();
        if ((presenter.slideLength !== -1) && (presenter.slideNumber < presenter.slideLength)) {
            presenter.slideNumber += 1;
            presenter.$setup.setSlideNumber(presenter.slideNumber);
            presenter.GotoFolie(presenter.slideNumber);
            var e = $.Event($.keynode('getEvents').presenter.slideChange);
            $(window).trigger(e, [presenter.slideNumber - 1, presenter.slideNumber]);

        } else {
            var curr_frame = document.getElementById(KeyNode.options.selectors.current_frame.substr(1))
            curr_frame.contentWindow.postMessage("getNumberSlides:a", "*");
        }
    },
    Prev: function() {
        presenter.slideNumber = presenter.$setup.getSlideNumber();
        if (presenter.slideNumber > 0) {
            presenter.slideNumber -= 1;
            presenter.$setup.setSlideNumber(presenter.slideNumber);
            presenter.GotoFolie(presenter.slideNumber);
            var e = $.Event($.keynode('getEvents').presenter.slideChange);
            $(window).trigger(e, [presenter.slideNumber + 1, presenter.slideNumber]);
        }
    },
    BindKeys: function() {
        $(document).unbind('keydown').keydown(function(e) {

            var options = KeyNode.options;
            if (e.which === options.keys.next
                    || $.inArray(e.which, options.keys.next) > -1) {
                presenter.Next();

                e.preventDefault();
            }
            else if (e.which === options.keys.previous
                    || $.inArray(e.which, options.keys.previous) > -1) {
                presenter.Prev();
                e.preventDefault();
            }

        });

        var after_Frame = document.getElementById(KeyNode.options.selectors.after_frame.substr(1)),
                curr_frame = document.getElementById(KeyNode.options.selectors.current_frame.substr(1));

        if (after_Frame === null || curr_frame === null) {
            setTimeout(function() {
                presenter.BindKeys();
            }, 500);
        } else {
            if (presenter.slideLength === -1 || presenter.diff === -1) {
                setTimeout(function() {
                    presenter.BindKeys();
                }, 500);
            }
            after_Frame.contentWindow.postMessage('setDiff:1', "*");
            curr_frame.contentWindow.postMessage("getNumberSlides:a", "*");
        }
        if (presenter.slideLength !== -1 && presenter.diff !== -1) {
            $(KeyNode.options.selectors.click_blocker).css({
                'height': '100%',
                'z-index': '10'
            });
            $(document).trigger($.keynode('getEvents').presenter.ready);
        }
    },
    initIframe: function() {
        if (!$(KeyNode.options.selectors.current_container)[0]) {
            setTimeout(presenter.initIframe, 500);
        } else {
            var url = presenter.$setup.getPresentationURL();
            var curr_container = KeyNode.options.selectors.current_container;
            var after_container = KeyNode.options.selectors.after_container;
            var click_blocker = '<div class="' + KeyNode.options.selectors.click_blocker.substr(1) + '"> </div>';
            var curr_frame = '<iframe src="' + url + '" width="100%" height="100%" id="'
                    + KeyNode.options.selectors.current_frame.substr(1)
                    + '" style="z-Index:0;border:none;"></iframe> ';
            var after_frame = '<iframe src="' + url + '" width="100%" height="100%" id="'
                    + KeyNode.options.selectors.after_frame.substr(1)
                    + '" style="z-Index:0;border:none;"></iframe> ';

            $(curr_container).html(curr_frame);
            $(curr_container).append(click_blocker);
            $(curr_container).html(curr_frame);
            $(curr_container).append(click_blocker);
            $(after_container).html(after_frame);
            $(after_container).append(click_blocker);
            presenter.BindKeys();
        }
    },
    initPresenterConsole: function() {
        $('body').find('*').hide();
        $(document).trigger($.keynode('getEvents').presenter.init);
        KeyNode.loadTmpl('presenter', function() {
            presenter.slideNumber = presenter.$setup.getSlideNumber();
            presenter.initIframe();
            KeyNode.loadJS('keynode.timer');
            KeyNode.loadJS('keynode.video');
            KeyNode.loadJS('keynode.qrcode');
        });

    },
    GotoFolie: function(folie) {
        //console.log(folie);
        var data = {
            name: presenter.$setup.getCanonicalURL(),
            folie: folie
        };
        presenter.$socket.broadcast('controlSync', data);

    }
};
presenter.initPresenterConsole();


var PresenterUI = {
    /**
     *  The bar at the edge of the screen where the video tab is.
     */
    MultiBar: {
        $MultiBar: null,
        barItems: [],
        init: function() {
            var MultiBar = PresenterUI.MultiBar;
            var $MultiBar = MultiBar.$MultiBar = $('<div id="multibar"></div>');
            $(document.body).append($MultiBar);
        },
        /**
         *  Add a PresenterUI.Tab or arbitrary other element to the MultiBar
         *  @param element
         *      What to add
         *  @param positionId
         *      Integer id indicating the position where the element should be inserted.
         *      Smaller positionIds will be placed left of greater positionIds.
         */
        add: function(element, positionId) {
            if ((element instanceof Array) || (element instanceof jQuery)) {
                for (var i = 0; i < element.length; i++) {
                    PresenterUI.MultiBar.add(element[i], positionId);
                }
                return;
            } else if (element instanceof PresenterUI.Tab) {
                element.attachedToMultiBar = PresenterUI.MultiBar;
                element = element.getContainer();
            }

            if (positionId) {
                var barItems = PresenterUI.MultiBar.barItems;
                for (var i = 0; i < barItems.length; i++) {
                    if (barItems[i].positionId > positionId) {
                        $(element).insertBefore(barItems[i].element);
                        var item = {
                            positionId: positionId,
                            element: element
                        };
                        PresenterUI.MultiBar.barItems = barItems.slice(0, i);
                        PresenterUI.MultiBar.barItems.push(item);
                        PresenterUI.MultiBar.barItems = PresenterUI.MultiBar.barItems.concat(barItems.slice(i));
                        return;
                    }
                }
            }

            // if no positionId is given or we reached the end of barItems, just add it to the end:
            PresenterUI.MultiBar.barItems.push({
                positionId: positionId,
                element: element
            });
            PresenterUI.MultiBar.$MultiBar.append(element);
        },
        remove: function(element) {
            if ((element instanceof Array) || (element instanceof jQuery)) {
                for (var i = 0; i < element.length; i++) {
                    PresenterUI.MultiBar.remove(element[i]);
                }
                return;
            } else if (element instanceof PresenterUI.Tab) {
                element.attachedToMultiBar = false;
                element = element.getContainer();
            }
            var barItems = PresenterUI.MultiBar.barItems;
            for (var i = 0; i < barItems.length; i++) {
                if (barItems[i] == element) {
                    PresenterUI.MultiBar.barItems = barItems.splice(i, 1);
                    $(element).detach();
                    return true;
                }
            }
            return false;
        }
    }
};

PresenterUI.MultiBar.init();


PresenterUI.Tab = function(title, id) {
    var that = this;
    this.title = title;
    this.slideState = false;
    this.attachedToMultiBar = false;

    this.$container = $('<div class="multibar-tab"></div>');
    if (id)
        this.$container.attr('id', id);

    this.$container.append(
            this.$h2 = $('<h2></h2>').text(title),
            this.$content = $('<div class="content"></div>')
            );

    this.$content.hide();
    this.$h2.click(function() {
        that.slideToggle();
    });
};

PresenterUI.Tab.prototype = {
    /** Returns the wrapping <div> DOM element */
    getContainer: function() {
        return this.$container[0];
    },
    /** Returns the `div.content` DOM child element */
    getContent: function() {
        return this.$content[0];
    },
    /** Event handler that is triggered by clicking on the tab title */
    slideToggle: function() {
        var that = this,
                h2MinOpacity = 0.3;

        if (!this.slideState) {
            // Content is not visible:
            this.$content.stop().slideDown(400);
            this.$h2.animate({opacity: h2MinOpacity}, 400);
            this.$h2.mouseenter(function() {
                that.$h2.stop().animate({opacity: 1}, 200);
            });
            this.$h2.mouseleave(function() {
                that.$h2.stop().animate({opacity: h2MinOpacity}, 200);
            });
            this.slideState = true;

        } else {

            // Content is visible:
            this.$content.stop().slideUp(400);
            this.$h2.animate({opacity: 1}, 400);
            this.$h2.unbind('mouseenter').unbind('mouseleave');
            this.slideState = false;
        }
    }
};

