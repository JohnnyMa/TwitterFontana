/**
= SettingsGUI =

The user interface for (a number of) settings.
*/

var Fontana = window.Fontana || {};
Fontana.config = Fontana.config || {};

Fontana.config.SettingsGUI = (function ($) {
    var SettingsGUI;

    SettingsGUI = function (container, settings) {
        var self = this;
        this.container = container;
        this.settings = settings;
        this.fields = [ 'twitter_search', 'effect', 'message_animate_interval',
                        'custom_css', 'font_face', 'text_color',
                        'special_color', 'bg_color',
                        'bg_image', 'box_bg',
                        'embed', 'preset'];
    };

    /**
     * Load settings from the url
     */
    SettingsGUI.prototype.loadSettingsFromUrl = function () {
        var settings = {}, params, i, pair, key, value;
        params = window.location.search.substring(1).replace(/\+/g, ' ').split('&');
        for (i = 0; i < params.length; i++) {
            pair = params[i].split('=')
            key = decodeURIComponent(pair[0]);
            value = decodeURIComponent(pair[1]);
            if ($.inArray(key, this.fields) > -1) {
                this.settings.set(key, value);
            }
        }

        if(this.settings.get('embed') == 'true') {
            $("body > header, body > footer").hide();
        }
    };

    /**
     * Generate the url for the current settings
     */
    SettingsGUI.prototype.generateEmbedCode = function () {
        // first generate the url
        var url;
        var query = {'embed': 'true'};
        url = location.protocol + '//' + location.host + location.pathname;
        $.each(this.fields, function (i, key) {
            var value = $('#' + key).val();
            if (value) {
                query[key] = value;
            }
        });
        url = url + '?' + $.param(query);

        // set iframe code
        $('#embed_html').val('<iframe src="'+ url +'" frameborder="0" width="100%" height="300" scrolling="no"></iframe>');
    };


    /**
     * Handle a value change in a settings form by updating
     * the settings object and updating the settings url field.
     */
    SettingsGUI.prototype.handleFormChange = function (el) {
        this.settings.set(el.name, $(el).val());
        this.generateEmbedCode();
    };

    /**
     * Load and initialize the settings panel
     */
    SettingsGUI.prototype.draw = function () {
        var self = this;

        this.container.empty();

        if(self.settings.get('embed') == 'true') {
            self.toggle(false);
        }

        $.get('partials/settings.html', function (html) {
            // Hide the settings panel in case of preset
            if(self.settings.get('embed') != 'true') {
                $("body").addClass("settings");
            }

            self.container.html(html);

            // Prefill the inputs with the current settings
            $.each(self.fields, function (i, key) {
                var field = $('#' + key);
                if (field) {
                    field.val(self.settings.get(key));
                }
            });
            self.generateEmbedCode();

            // Listen for change events on the inputs
            $(':input', self.container).change(function () {
                self.handleFormChange.call(self, this);
            });

            // Listen to submit events on the forms
            $('form', self.container).submit(function (e) {
                e.preventDefault();
                $(':input', this).each(function () {
                    self.handleFormChange.call(self, this);
                });
            });

            // Select the settings url on click
            $('#embed_html').bind('click', function () {
                $(this).select();
            });

            // Initialize the color pickers
            $('.color', self.container).each(function () {
                var input = $(this);
                var pickerElement = $('<div class="picker"></div>').insertAfter($(this));
                var swatch = $('<div class="swatch"></div>').insertAfter($(this));
                var picker = $.farbtastic(pickerElement);

                pickerElement.hide();
                swatch.click(function () { input.focus(); });
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
                });
            });
        });
    };


    /**
     * Show/Hide the settings panel.
     */
    SettingsGUI.prototype.toggle = function(show) {
        $("body").toggleClass("settings", show);
    };

    return SettingsGUI;
}(window.jQuery));
