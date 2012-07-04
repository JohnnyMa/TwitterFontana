var Fontana = window.Fontana || {};

Fontana.utils = (function ($) {
    var prettyDate, requestFullscreen, exitFullscreen, vendors;

    prettyDate = function (time) {
        var date = new Date(time),
            diff = (((new Date()).getTime() - date.getTime()) / 1000),
            day_diff = Math.floor(diff / 86400);

        if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) {
            return time;
        }
        if (!day_diff && diff < 60) { return 'just now'; }
        if (!day_diff && diff < 120) { return '1 minute ago'; }
        if (!day_diff && diff < 3600) { return Math.floor(diff / 60) + ' minutes ago'; }
        if (!day_diff && diff < 7200) { return '1 hour ago'; }
        if (!day_diff && diff < 86400) { return Math.floor(diff / 3600) + ' hours ago'; }
        if (day_diff === 1) { return 'Yesterday'; }
        if (day_diff < 7) { return day_diff + ' days ago'; }
        if (day_diff < 31) { return Math.ceil(day_diff / 7) + ' weeks ago'; }
    };

    vendors = ['webkit', 'moz', 'o', 'ms'];

    requestFullscreen = function (el) {
        var request = el.requestFullscreen;
        $.each(vendors, function (i, vendor) {
            if (request) { return false; }
            request = el[vendor + 'RequestFullScreen'];
        });
        if (request) {
            request.call(el);
        }
    };

    exitFullscreen = function () {
        var request = document.exitFullscreen;
        $.each(vendors, function (i, vendor) {
            if (request) { return false; }
            request = document[vendor + 'CancelFullScreen'];
        });
        if (request) {
            request();
        }
    };

    return {
        'prettyDate': prettyDate,
        'requestFullscreen': requestFullscreen,
        'exitFullscreen': exitFullscreen
    };
}(window.jQuery));
