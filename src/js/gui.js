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
        this.datasourceListener = null;
        this.settings = settings;
        this.messages = [];
        this.animateTimer = -1;
        this.animateScheduled = null;
        this.animatePause = null;
        this.current = null;
        this.effect = null;
        this.style_settings = [ 'font_face', 'text_color', 'custom_css',
                                'special_color', 'bg_color',
                                'bg_image', 'box_bg'];
        this.settings.bind('change', function () {
            self.handleSettingsChange.apply(self, arguments);
        });
    };

    /**
     * Handle settings changes
     */
    GUI.prototype.handleSettingsChange = function (setting, old, value) {
        if (setting == 'twitter_search') {
            this.clear();
            if (value) {
                if (this.datasource) {
                    this.datasource.stop();
                }
                this.datasource = new Fontana.datasources.Twitter(value);
                this.setupDatasourceListener();
                this.datasource.getMessages();
            }
        }
        if (setting == 'effect') {
            this.pause();
            if (this.effect) {
                this.effect.destroy();
                this.effect = null;
            }
            this.animateMessages();
        }
        if ($.inArray(setting, this.style_settings) > -1) {
            this.updateStyle();
        }
    };

    /* Setup datasource listener */
    GUI.prototype.setupDatasourceListener = function () {
        var self = this;
        this.datasourceListener = function (messages) {
            self.handleMessages.call(self, messages);
        };
        this.datasource.bind('messages', this.datasourceListener);
    };

    /**
     * Handle the messages from the datasource
     */
    GUI.prototype.handleMessages = function (messages) {
        var self = this, elements = [];
        this.pause();
        elements = $.map(messages, function (message) {
            return self.formatMessage(message)[0];
        });
        this.container.prepend(elements);
        this.current = null;
        this.resume();
    };

    /**
     * Purge messages in the DOM (if necesarry)
     */
    GUI.prototype.purgeMessages = function (messages) {
        var all = $('.fontana-message', this.container);
        if (all.length >= 30) {
            if (all.index(this.current) < all.length / 2) {
                all.slice(Math.floor(all.length / 2)).remove();
            }
            else {
                this.current.nextAll('.fontana-message').remove();
            }
        }
    };

    /* display methods */

    /**
     * Create HTML from a datasource object
     */
    GUI.prototype.formatMessage = function (message) {
        message.html = twttr.txt.autoLink(message.text);
        return $.tmpl(this.settings.get('message_template'), message);
    };

    /**
     * Create CSS according to the current settings
     */
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

    GUI.prototype.scheduleAnimation = function () {
        var self = this, nextInterval = this.settings.get('message_animate_interval');
        if (this.animatePause && this.animateScheduled) {
            nextInterval -= this.animatePause.getTime() - this.animateScheduled.getTime();
        }
        if (!this.animateScheduled || nextInterval < 0) {
            nextInterval = 0;
        }
        this.animateTimer = window.setTimeout(function () {
            self.animateMessages.call(self);
        }, nextInterval);
        this.animateScheduled = new Date();
    };

    /**
     * Transition from one message to the next one
     */
    GUI.prototype.animateMessages = function () {
        var self = this, next, effectName, nextTime;
        if (!this.effect) {
            effectName = this.settings.get('effect');
            this.effect = new Fontana.effects[effectName](this.container, '.fontana-message');
        }
        if (!this.current || !this.current.next().length) {
            next = $('.fontana-message:first', this.container);
        } else {
            next = this.current.next();
        }

        // update time
        nextTime = $('time', next);
        nextTime.text(Fontana.utils.prettyDate(nextTime.attr('title')));
        // transition
        this.effect.next(next, function () {
            // cleanup
            self.current = next;
            self.purgeMessages.call(self);
        });
        this.scheduleAnimation();
    };

    /* public control methods */

    /**
     * Start the fountain in the given container
     */
    GUI.prototype.start = function (node) {
        var self = this;
        this.container = node;
        this.updateStyle();
        this.clear();
        this.setupDatasourceListener();
        this.datasource.getMessages();
    };

    /**
     * Stop all running timers
     */
    GUI.prototype.pause = function () {
        this.datasource.unbind('messages', this.datasourceListener);
        this.datasourceListener = null;
        window.clearTimeout(this.animateTimer);
        this.animatePause = new Date();
    };

    /**
     * Restart all timers
     */
    GUI.prototype.resume = function () {
        var self = this;
        this.setupDatasourceListener();
        this.scheduleAnimation();
        this.animatePause = null;
    };

    /**
     * Reset the messages
     */
    GUI.prototype.reset = function () {
        this.current = null;
        this.animateScheduled = null;
        this.animatePause = null;
        this.container.empty();
    };

    /**
     * Reset the messages and stop all timers
     */
    GUI.prototype.clear = function () {
        this.pause();
        this.reset();
        this.animatePause = null;
    };

    return GUI;
}(window.jQuery));
