var Fontana = window.Fontana || {};

Fontana.effects = (function ($) {
    var Base, Fade, Slide, Zoom;

    /**
     * Base effect class
     * @param   jQuery  container
     * @param   string  selector
     */
    Base = function (container, selector) {
        this.container = container;
        this.selector = selector;
        this.duration = 0;
        this.before_show_prop = {};
        this.show_prop = {};
        this.hide_prop = {};
        this.cur_element = null;

        var self = this;

        $(window).bind("resize", function() {
            self.positionVerticalMiddle();
        });
    };

    Base.prototype.positionVerticalMiddle = function (element) {
        if(!element) {
            element = this.cur_element;
        }

        var baseHeight = this.container.height() - (this.container.height() % 12) - 24;
        element.css({ top: Math.floor((baseHeight - element.height()) / 2) });
    };

    Base.prototype.next = function (element, callback) {
        var self = this;
        this.positionVerticalMiddle(element);
        if (this.cur_element) {
            this.cur_element.animate(this.hide_prop, {
                'duration': this.duration,
                'complete': function () {
                    element.animate(self.before_show_prop, 0)
                        .animate(self.show_prop, {
                            'duration': this.duration,
                            'complete': callback
                        });
                }});
        } else {
            element.animate(this.before_show_prop, 0)
                .animate(this.show_prop, {
                    'duration': this.duration,
                    'complete': callback
                });
        }
        this.cur_element = element;
    };

    Base.prototype.destroy = function () {
        $(this.selector, this.container).stop().removeAttr('style').hide();
    };

    /**
     * fade effect
     */
    Fade = function (container, selector) {
        Base.call(this, container, selector);
        this.duration = 500;
        this.show_prop = {opacity: 'show'};
        this.hide_prop = {opacity: 'hide'};
    };
    $.extend(Fade.prototype, Base.prototype);


    /**
     * slide effect
     */
    Slide = function (container, selector) {
        Base.call(this, container, selector);
        this.duration = 500;
        this.before_show_prop = {left: -100};
        this.show_prop = {opacity: 'show', left: 0};
        this.hide_prop = {opacity: 'hide', left: 100};
    };
    $.extend(Slide.prototype, Base.prototype);


    /**
     * zoom effect
     */
    Zoom = function (container, selector) {
        Base.call(this, container, selector);
        this.duration = 500;
        this.before_show_prop = {scale: 0.5};
        this.show_prop = {opacity: 'show', scale: 1};
        this.hide_prop = {opacity: 'hide', scale: 5};
    };
    $.extend(Zoom.prototype, Base.prototype);

    return {
        'Base': Base,
        'Fade': Fade,
        'Slide': Slide,
        'Zoom': Zoom
    };
}(window.jQuery));
