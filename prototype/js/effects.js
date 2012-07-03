var Effect = {};

/**
 * fade effect
 */
Effect.Fade = (function() {
    var effect;
    function setup(container, list) {
        effect = new Effect.Basic(container, list, 500,
            { },
            { opacity: 'show' },
            { opacity: 'hide' });
    }

    return {
        name: 'fade',
        setup: setup,
        next: function(el){ return effect.next(el); },
        destroy: function(){ return effect.destroy(); }
    }
})();


/**
 * slide effect
 */
Effect.Slide = (function() {
    var effect;
    function setup(container, list) {
        effect = new Effect.Basic(container, list, 500,
            { left: -100 },
            { opacity: 'show', left: 0 },
            { opacity: 'hide', left: 100 });
    }

    return {
        name: 'slide',
        setup: setup,
        next: function(el){ return effect.next(el); },
        destroy: function(){ return effect.destroy(); }
    }
})();


/**
 * zoom effect
 */
Effect.Zoom = (function() {
    var effect;
    function setup(container, list) {
        effect = new Effect.Basic(container, list, 500,
            { scale: .5 },
            { opacity: 'show', scale: 1 },
            { opacity: 'hide', scale: 5 });
    }

    return {
        name: 'zoom',
        setup: setup,
        next: function(el){ return effect.next(el); },
        destroy: function(){ return effect.destroy(); }
    }
})();


/**
 * basic effect class
 * @param   jQuery  container
 * @param   jQuery  list
 * @param   int     duration
 * @param   object  before_show_prop
 * @param   object  show_prop
 * @param   object  hide_prop
 */
Effect.Basic = function(container, list, duration, before_show_prop, show_prop, hide_prop) {
    var prev_element;

    function next( element ) {
        positionVerticalMiddle(element);

        if(prev_element) {
            prev_element.animate(hide_prop, duration, function() {
                element.animate(before_show_prop, 0)
                    .animate(show_prop, duration);

                // remove the previous tweet
                $(this).remove();
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
        $(">li", list).stop()
            .removeAttr("style")
            .hide();
    }

    return {
        next: next,
        destroy: destroy
    }
};
