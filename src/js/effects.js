var Fontana = window.Fontana || {};

Fontana.effects = (function () {
    var Basic, Fade, Slide, Zoom;


    /**
     * basic effect class
     * @param   jQuery  container
     * @param   string  selector
     * @param   int     duration
     * @param   object  before_show_prop
     * @param   object  show_prop
     * @param   object  hide_prop
     */
    Basic = function(container, selector, duration, before_show_prop, show_prop, hide_prop) {
        var prev_element;

        function next( element ) {
            positionVerticalMiddle(element);

            if(prev_element) {
                prev_element.animate(hide_prop, duration, function() {
                    element.animate(before_show_prop, 0)
                        .animate(show_prop, duration);
                });
            } else {
                element.animate(before_show_prop, 0)
                    .animate(show_prop, duration);
            }

            prev_element = element;
        }

        function positionVerticalMiddle(element) {
            element.css({ top: (container.height() - element.height()) / 2 });
        }

        function destroy() {
            $(selector, container).stop()
                .removeAttr("style")
                .hide();
        }

        return {
            next: next,
            destroy: destroy
        }
    };


    /**
     * fade effect
     */
    Fade = (function() {
        var effect;
        function setup(container, selector) {
            effect = new Basic(container, selector, 500,
                { },
                { opacity: 'show' },
                { opacity: 'hide' });
        }

        return {
            name: 'fade',
            setup: setup,
            next: function(el){ if (effect) effect.next(el); },
            destroy: function(){ if (effect) effect.destroy(); }
        }
    })();


    /**
     * slide effect
     */
    Slide = (function() {
        var effect;
        function setup(container, selector) {
            effect = new Basic(container, selector, 500,
                { left: -100 },
                { opacity: 'show', left: 0 },
                { opacity: 'hide', left: 100 });
        }

        return {
            name: 'slide',
            setup: setup,
            next: function(el){ if (effect) effect.next(el); },
            destroy: function(){ if (effect) effect.destroy(); }
        }
    })();


    /**
     * zoom effect
     */
    Zoom = (function() {
        var effect;
        function setup(container, selector) {
            effect = new Basic(container, selector, 500,
                { scale: .5 },
                { opacity: 'show', scale: 1 },
                { opacity: 'hide', scale: 5 });
        }

        return {
            name: 'zoom',
            setup: setup,
            next: function(el){ if (effect) effect.next(el); },
            destroy: function(){ if (effect) effect.destroy(); }
        }
    })();

    return {
        'Basic': Basic,
        'Fade': Fade,
        'Slide': Slide,
        'Zoom': Zoom
    }
}());
