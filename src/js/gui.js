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
		this.datasource = datasource;
		this.settings = settings;
		this.messages = [];
		this.dataRefreshTimer = -1;
		this.animateTimer = -1;
		this.current = null;
		this.effect = null;
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
			this.current.prevAll('.fontanta-message').remove();
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

	GUI.prototype.animateMessages = function () {
		var self = this, next, effectName;
		if (!this.effect) {
			effectName = this.settings.get('effect');
			this.effect = new Fontana.effects[effectName](this.container,
													  '.fontanta-message');
		}
		if (!this.current || !this.current.next().length) {
			next = $('.fontanta-message:first', this.container);
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
		if (this.effect) {
			this.effect.destroy();
		}
	};

	GUI.prototype.clear = function () {
		this.pause();
		this.reset();
	};

	return GUI;
}(window.jQuery));
