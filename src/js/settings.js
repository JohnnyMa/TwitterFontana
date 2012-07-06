/**
= Settings =

The settings container for Fontana.

After construction it will contain the default settings for Fontana.

Settings can be retrieved using the `get` instance method. It takes the
settings key as an argument.

Settings can be changed using the `set` method. It takes the settings key and
the new value.

Mass updates can be done with the `update` method. This method takes a
object of key value pairs.

The settings can be observed by binding functions to listen to the
`change` event. On each setting change the observers will be notified about
which key has changed, the previous value and the new value.
*/

var Fontana = window.Fontana || {};
Fontana.config = Fontana.config || {};

Fontana.config.Settings = (function ($) {
    var Settings, defaults;

    defaults = {
        'message_animate_interval': 6 * 1000, /* ms */
        'message_template': '<div class="fontana-message"> ' +
                            '    <q>{{html html}}</q> ' +
                            '    <figure><img src="${profile_image_url}" width="64" height="64"></figure> ' +
                            '    <cite>@${from_user}</cite>' +
                            '    <time>${Fontana.utils.prettyDate(created_at)}</time>' +
                            '</div>',
        'style_template': '#${container_id} {' +
                          '    background: ${bg_color} url(${bg_image}) no-repeat center center;' +
                          '    background-size: cover;' +
                          '}' +
                          '.fontana-message {' +
                          '    background: ${box_bg};' +
                          '    color: ${text_color};' +
                          '    font-family: ${font_face||"sans-serif"};' +
                          '}' +
                          '.fontana-message a {' +
                          '    color: ${text_color}' +
                          '}' +
                          '.fontana-message .hashtag, .fontana-message .username {'+
                          '    color: ${special_color}' +
                          '}',
        'twitter_search': 'Twitter',
        'effect': 'Slide',
        'font-face': 'Open Sans, sans-serif',
        'text_color': '#ffffff',
        'special_color': '#aaea71',
        'bg_color': '#76ab30',
        'box_bg': '#80b43c'
    };

    Settings = function () {
        this.settings = defaults;
    };

    /**
     * Get a setting by its key
     */
    Settings.prototype.get = function (key) {
        return this.settings[key];
    };

    /**
     * Set a setting to a new value
     */
    Settings.prototype.set = function (key, value) {
        var old = this.get(key);
        this.settings[key] = value;
        if (old !== value) {
            this.trigger('change', key, old, value);
        }
    };

    /**
     * Update multiple settings by passing in a object
     * with key->value pairs
     */
    Settings.prototype.update = function (settings) {
        var self = this;
        $.each(settings, function (key, value) {
            self.set(key, value);
        });
    };

    // Make it eventful
    window.MicroEvent.mixin(Settings);

    return Settings;
}(window.jQuery));
