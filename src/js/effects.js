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
        this.prev_element = null;
    };

    Base.prototype.positionVerticalMiddle = function (element) {
        element.css({ top: (this.container.height() - element.height()) / 2 });
    };

    Base.prototype.next = function (element) {
        var self = this;
        this.positionVerticalMiddle(element);
        if (this.prev_element) {
            this.prev_element.animate(this.hide_prop, this.duration,
                function () {
                    element.animate(self.before_show_prop, 0)
                        .animate(self.show_prop, self.duration);
                });
        } else {
            element.animate(this.before_show_prop, 0)
                .animate(this.show_prop, this.duration);
        }
        this.prev_element = element;
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
