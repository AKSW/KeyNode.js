
var TimerAddon = {
    $timer : null,
    interval : null,
    timeMinutes : 0,
    timeSeconds : 0,
    minOpacity : 0.6,
    
    init : function () {
        var minOpacity = TimerAddon.minOpacity;
        var $timer = TimerAddon.$timer = $('<div id="timer"></div>');
        $timer
        .css({opacity: minOpacity})
        .mouseenter(function() { $timer.animate({opacity: 1}, 200) })
        .mouseleave(function() { $timer.animate({opacity: minOpacity}, 200) })
        .click(TimerAddon.startOrPause)
        .dblclick(TimerAddon.resetTimer);
        
        TimerAddon.updateTime();
        PresenterUI.MultiBar.add($timer, 10);
    },
    
    startOrPause : function () {
        if(TimerAddon.interval) {
            // is running, so pause:
            window.clearInterval(TimerAddon.interval);
            TimerAddon.interval = null;
        } else {
            // is paused so resume:
            TimerAddon.interval = window.setInterval(TimerAddon.intervalHandler, 1000);
        }
    },
    
    resetTimer : function () {
        if(TimerAddon.interval) {
            window.clearInterval(TimerAddon.interval);
            TimerAddon.interval = null;
        }
        TimerAddon.timeMinutes = TimerAddon.timeSeconds = 0;
        TimerAddon.updateTime();
    },
    
    intervalHandler : function () {
        TimerAddon.timeSeconds++;
        if(TimerAddon.timeSeconds == 60) {
            TimerAddon.timeMinutes++;
            TimerAddon.timeSeconds = 0;
        }
        TimerAddon.updateTime();
    },
    
    updateTime : function () {
        var minutes = TimerAddon.timeMinutes,
            seconds = TimerAddon.timeSeconds;
        minutes = minutes < 10 ? '0'+minutes : minutes;
        seconds = seconds < 10 ? '0'+seconds : seconds;
        TimerAddon.$timer.text(minutes+':'+seconds);
    }
};


setTimeout(function() {
    TimerAddon.init();
}, 500);

