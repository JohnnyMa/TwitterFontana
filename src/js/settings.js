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


Fontana.Settings = (function ($) {
	var Settings, defaults;

	defaults = {
		'data_refresh_interval': 45 * 1000, /* ms */
		'message_animate_interval': 5.5 * 1000, /* ms */
		'message_template': '<div class="fontana-message">\
							   <q>{{html text}}</q>\
							   <figure><img src="${profile_image_url}" width="64" height="64"></figure>\
                               <cite>@${from_user}</cite>\
                               <time>${Fontana.utils.prettyDate(created_at)}</time>\
                             </div>',
        'effect': 'Fade'
	};

	Settings = function () {
		this.settings = defaults;
	};

	Settings.prototype.get = function (key) {
		return this.settings[key];
	};

	Settings.prototype.set = function (key, value) {
		var old = this.get(key);
		this.settings[key] = value;
		this.trigger('change', key, old, value);
	};

	Settings.prototype.update = function (settings) {
		var self = this;
		$.each(settings, function (key, value) {
			self.set(key, value);
		});
	};

	window.MicroEvent.mixin(Settings);

	return Settings;
}(window.jQuery));
