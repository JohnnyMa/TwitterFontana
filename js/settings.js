var settings = (function () {
    var panel = $("#settings");
    var fields = $("input:text:not([name=settings_url]), select", panel);

    /**
     * Load settings from the url
     */
    var loadSettingsFromUrl = function () {
        var settings = {};
        var vars = window.location.search.substring(1).split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            settings[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);

        }
        fields.each(function (i, f) {
            f.value = settings[f.name];
        });
    }

    /**
     * Generate the url for the current settings
     */
    var generateSettingsUrl = function () {
        var url = location.protocol+"//"+ location.host + location.pathname;
        var query = []
        fields.each(function (i, f) {
            query.push(encodeURIComponent(f.name) + '=' + encodeURIComponent(f.value));
        });
        var query = fields.serialize();
        return url +"?"+ query;
    }

    /**
     * Collect the current settings from the form fields
     */
    var getCurrentSettings = function () {
        var settings = {};
        fields.each(function (i, f) {
            settings[f.name] = f.value;
        });
        return settings;
    }

    /**
     * Settings panel display methods
     */
    var showSettings = function () {
        panel.slideDown();
    }

    var hideSettings = function () {
        panel.slideUp();
    }

    var toggleSettings = function () {
        if (panel.is(':visible')) {
            hideSettings();
        } else {
            showSettings();
        }
    }

    // when no location search is given (so no settings)
    // we show the editor
    if(location.search == '') {
        panel.show();
    }
    else {
        loadSettingsFromUrl();
    }

    // initialize the color pickers
    $('.color', panel).each(function () {
        var input = $(this);
        var pickerElement = $('<div class="picker"></div>').insertAfter($(this));
        var swatch = $('<div class="swatch"></div>').insertAfter($(this));
        var picker = $.farbtastic(pickerElement);

        pickerElement.hide();
        swatch.click(function () { input.focus() });
        swatch.css('background-color', input.val());
        picker.setColor(input.val());

        input.focus(function () {
            pickerElement.fadeIn('fast');
            picker.linkTo(function (color) {
                swatch.css('background-color', color);
                input.val(color).change();
            });
        });

        input.blur(function () {
            pickerElement.fadeOut('fast');
            picker.setColor(input.val());
            swatch.css('background-color', input.val());
        });

        input.keyup(function () {
            picker.setColor(input.val());
            swatch.css('background-color', input.val());
        })
    });

    return {
        'showSettings': showSettings,
        'hideSettings': hideSettings,
        'toggleSettings': toggleSettings,
        'getCurrentSettings': getCurrentSettings,
        'generateSettingsUrl': generateSettingsUrl
    }
}());
