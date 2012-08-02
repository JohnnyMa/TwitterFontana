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
    SettingsGUI.prototype.generateSettingsUrl = function (query) {
        var url;
        var query = query || {'preset': 'true'};
        url = location.protocol + '//' + location.host + location.pathname;
        $.each(this.fields, function (i, key) {
            var value = $('#' + key).val();
            if (value) {
                query[key] = value;
            }
        });
        return url + '?' + $.param(query);
    };

    SettingsGUI.prototype.generateEmbedCode = function () {
        // first generate the url
        var url = this.generateSettingsUrl({'embed': 'true'}) + '&utm_source=site&utm_medium=embed&utm_campaign=twitterfontana';
        return '<iframe src="'+ url +'" frameborder="0" width="100%" height="300" scrolling="no"></iframe><a href="http://twitterfontana.com" target="_blank" title="Create your own Twitter Fountain">Powered by Twitter Fontana</a>';
    };

    /**
     * Handle a value change in a settings form by updating
     * the settings object and updating the settings url field.
     */
    SettingsGUI.prototype.handleFormChange = function (el) {
        this.settings.set(el.name, $(el).val());
        this.updatePresetUrl();
        this.updateEmbedCode();
    };

    /**
     * Load and initialize the settings panel
     */
    SettingsGUI.prototype.draw = function () {
        var self = this;

        this.container.empty();

        $.get('partials/settings.html', function (html) {
            // Hide the settings panel in case of preset
            if(self.settings.get('embed') != 'true') {
                $("body").addClass("settings");
            }

            self.container.html(html);

            if(self.settings.get('embed') == 'true' || self.settings.get('preset') == 'true') {
                self.toggle(false);
            }

            // Prefill the inputs with the current settings
            $.each(self.fields, function (i, key) {
                var field = $('#' + key);
                if (field) {
                    field.val(self.settings.get(key));
                }
            });
            self.updatePresetUrl();
            self.updateEmbedCode();

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

            // Show/Hide advanced search operators on click
            $('.search-operators', self.container).click(function (e) {
                e.preventDefault();
                $('#search_operators').slideToggle();
            });

            // Toggle the embed html/preset url textareas on label click
            $('#embedForm label').click(function (e) {
                $('#embedForm label').removeClass('active')
                $(this).addClass('active');
                $('#embed_html, #preset_url').hide();
                $('#' + $(this).attr('for')).show();
            });

            // Select the settings url on click
            $('#embed_html, #preset_url').click(function (e) {
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
    * Update preset url field
    */
    SettingsGUI.prototype.updatePresetUrl = function() {
         $('#preset_url').val(this.generateSettingsUrl() + '&utm_source=site&utm_medium=preset&utm_campaign=twitterfontana');
         $('#share-on-twitter').attr('data-url', this.generateSettingsUrl() + '&utm_source=twitter&utm_medium=preset&utm_campaign=twitterfontana');
    };

    /**
    * Update embed code field
    */
    SettingsGUI.prototype.updateEmbedCode = function() {
         $('#embed_html').val(this.generateEmbedCode());
    };

    /**
     * Show/Hide the settings panel.
     */
    SettingsGUI.prototype.toggle = function(show) {
        $('body').toggleClass('settings', show);
        $(window).trigger('resize');
    };

    return SettingsGUI;
}(window.jQuery));
