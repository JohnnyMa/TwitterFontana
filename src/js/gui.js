/**
= FontanaGUI =

FontanaGUI is the main class responsible for displaying messages.

The constructor takes a datasource instance and a settings instance.

== Display methods ==

There are 3 methods to control the visualisation:

 * start
 * pause
 * resume
 * clear

`Start` takes a DOM node (selected with jQuery). This is DOM element
that the Fontana will animate in.

`Pause` will halt all animations and data retrieval.

`Resume` will continue a halted Fontana.

`Clear` will remove Fontana.
*/

var Fontana = window.Fontana || {};


Fontana.GUI = (function ($) {
	var GUI;

	GUI = function (datasource, settings) {
		var self = this;
		this.datasource = datasource;
		this.settings = settings;
		this.messages = [];
		this.dataRefreshTimer = -1;
		this.animateTimer = -1;
		this.current = null;
		this.effect = null;
		this.style_settings = [ 'font_face', 'text_color',
								'special_color', 'bg_color',
								'bg_image', 'box_bg'];
		this.settings.bind('change', function () {
			self.handleSettingsChange.apply(self, arguments);
		});
	};

	GUI.prototype.handleSettingsChange = function (setting, old, value) {
		if (setting == 'twitter-search') {
			this.clear();
			this.datasource = new Fontana.datasources.Twitter(value);
			this.getMessages();
		}
		if (setting == 'effect') {
			this.pause();
			if (this.effect) {
				this.effect.destroy();
				this.effect = null;
			}
			this.resume();
		}
		if ($.inArray(setting, this.style_settings) > -1) {
			this.updateStyle();
		}
	};

	/* data retrieval methods */

	GUI.prototype.getMessages = function () {
		var self = this;
		this.datasource.getMessages(function (messages) {
			self.handleMessages.call(self, messages);
		});
	};

	GUI.prototype.handleMessages = function (messages) {
		var self = this;
		this.pause();
		if (this.current) {
			this.current.prevAll('.fontana-message').remove();
		}
		$.each(messages, function (i, message) {
			self.container.append(self.formatMessage(message));
		});
		this.resume();
	};

	/* display methods */

	GUI.prototype.formatMessage = function (message) {
		var html;
		html = $.tmpl(this.settings.get('message_template'), message);
		return html;
	};

	GUI.prototype.updateStyle = function () {
		var self = this, options = {};
		$.each(this.style_settings, function (i, key) {
			options[key] = self.settings.get(key);
		});
		if (!this.container.attr('id')) {
			this.container.attr('id', 'fontana-' + new Date().getTime());
		}
		options['container_id'] = this.container.attr('id');
        if(this.style_tag) {
            this.style_tag.remove();
        }
        this.style_tag = $.tmpl("<style type='text/css'>" + this.settings.get('style_template') + "</style>", options)
            .appendTo("head");
	};

	GUI.prototype.animateMessages = function () {
		var self = this, next, effectName;
		if (!this.effect) {
			effectName = this.settings.get('effect');
			this.effect = new Fontana.effects[effectName](this.container, '.fontana-message');
		}
		if (!this.current || !this.current.next().length) {
			next = $('.fontana-message:first', this.container);
		} else {
			next = this.current.next();
		}
		this.effect.next(next);
		this.current = next;

		this.animateTimer = window.setTimeout(function () {
			self.animateMessages.call(self);
		}, this.settings.get('message_animate_interval'));
	};

	/* public control methods */

	GUI.prototype.start = function (node) {
		this.container = node;
		this.clear();
		this.getMessages();
	};

	GUI.prototype.pause = function () {
		window.clearTimeout(this.dataRefreshTimer);
		window.clearTimeout(this.animateTimer);
	};

	GUI.prototype.resume = function () {
		var self = this;
		this.dataRefreshTimer = window.setTimeout(function () {
			self.getMessages.call(self);
		}, this.settings.get('data_refresh_interval'));
		this.animateMessages();
	};

	GUI.prototype.reset = function () {
		this.current = null;
		this.container.empty();
	};

	GUI.prototype.clear = function () {
		this.pause();
		this.reset();
	};

	return GUI;
}(window.jQuery));
