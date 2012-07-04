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
Fontana.config = {};

Fontana.config.Settings = (function ($) {
	var Settings, defaults;

	defaults = {
		'data_refresh_interval': 45 * 1000, /* ms */
		'message_animate_interval': 5.5 * 1000, /* ms */
		'message_template': '<div class="fontana-message"> ' +
							'    <q>{{html text}}</q> ' +
							'    <figure><img src="${profile_image_url}" width="64" height="64"></figure> ' +
							'    <cite>@${from_user}</cite>' +
							'    <time>${Fontana.utils.prettyDate(created_at)}</time>' +
							'</div>',
		'style_template': '#${container_id} {' +
                          '    background: ${bg_color} url(${bg_image}) no-repeat center center;' +
                          '    background-size: contain;' +
                          '}' +
                          '.fontana-message {' +
                          '    background: ${box_bg};' +
                          '    color: ${text_color};' +
                          '    font-family: ${font_face||"sans-serif"};' +
                          '}',
        'effect': 'Slide',
        'twitter_search': 'Twitter'
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
		if (old !== value) {
			this.trigger('change', key, old, value);
		}
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

/**
= SettingsGUI =

The user interface for (a number of) settings.
*/

Fontana.config.SettingsGUI = (function ($) {
	var SettingsGUI;

	SettingsGUI = function (container, settings) {
		var self = this;
		this.container = container;
		this.settings = settings;
	};

	SettingsGUI.prototype.handleFormChange = function (el) {
		this.settings.set(el.name, $(el).val());
	};

	SettingsGUI.prototype.draw = function () {
		var self = this;
		this.container.empty();
		$.get('partials/settings.html', function (html) {
			self.container.html(html);
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

	SettingsGUI.prototype.toggle = function () {
		$('#settings').slideToggle('fast');
	};

	return SettingsGUI
}(window.jQuery));
