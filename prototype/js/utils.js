var utils = (function () {
    var prettyDate = function (time) {
        var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
            diff = (((new Date()).getTime() - date.getTime()) / 1000),
            day_diff = Math.floor(diff / 86400);

        if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
            return;

        return day_diff == 0 && (
            diff < 60 && "just now" ||
                diff < 120 && "1 minute ago" ||
                diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
                diff < 7200 && "1 hour ago" ||
                diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
            day_diff == 1 && "Yesterday" ||
            day_diff < 7 && day_diff + " days ago" ||
            day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
    }

    var vendors = ["webkit", "moz", "o", "ms"];

    var requestFullscreen = function (el) {
        var request = el.requestFullscreen;
        $.each(vendors, function (i, vendor) {
            if (request) return false;
            request = el[vendor + "RequestFullScreen"];
        });
        if (request) {
            request.call(el);
        }
        else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }

    var exitFullscreen = function () {
        var equest = document.exitFullscreen;
        for (vendor in vendors) {
            if (request) break;
            request = el[vendor + "CancelFullScreen"];
        }
        if (request) {
            request();
        }
    }

    var isFullscreen = function () {
        var state = null;
        document.exitFullscreen;
    }

    return {
        'prettyDate': prettyDate,
        'requestFullscreen': requestFullscreen,
        'exitFullscreen': exitFullscreen,
        'isFullscreen': isFullscreen
    }
}());
