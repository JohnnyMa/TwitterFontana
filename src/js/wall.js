function Wall(container, options) {
    var self = this;
    container = $(container);

    var defaults = {
        search: 'Twitter',
        search_url: 'http://search.twitter.com/search.json?result_type=recent&include_entities=true&callback=?',
        list: $('> ol', container),

        update_interval : 30,  // seconds
        tweet_interval: 6,  // seconds

        effect: 'Fade',

        tweet_template: '<div class="tweet"><q>{{html html}}</q><figure><img src="${profile_image_url}" width="64" height="64"></figure> \
                         <cite>@${from_user}</cite> <time>${utils.prettyDate(created_at)}</time></div>',

        style_template: '.wall { background: ${bg_color} url(${bg_image}) no-repeat center center; background-size: contain; } \
                         .tweet { background: ${tweets_bg}; color: ${tweets_color}; font-family: ${font_face||"sans-serif"}; } \
                         .bar { background: ${bg_color} url(${bg_image}); }' };
    options = $.extend(defaults, options);

    // setup the effect
    settings(options);

    var _update_timer;
    var _animation_timer;
    var _last_tweet_id = 0;
    var _style_tag;

    /**
     * get all tweets from twitter
     * and sets new timeout for looping
     */
    function getTweets( callback ) {
        $.getJSON(options.search_url, { q: options.search, since_id: _last_tweet_id+1  }, function(data, status) {
            if(status == 'success') {
                // walk tweets and add to the list
                for(var i= 0, len=data.results.reverse().length; i<len; i++) {
                    addTweet(data.results[i]);
                }

                if($.isFunction(callback)) {
                    callback.call(self, data);
                }
            }

            // set timeout
            _update_timer = setTimeout(getTweets, options.update_interval * 1000);
        });
    }


    /**
     * show the tweets with an animation
     */
    function animateTweets() {
        clearTimeout(_animation_timer);

        var current;

        function showNext() {
            var next;

            if(!current) {
                next = options.list.find(">li:first");
            } else {
                next = current.next();
            }

            if(next.length) {
                options.effect.next( next );
                current = next;
            }

            _animation_timer = setTimeout(showNext, options.tweet_interval * 1000);
        }

        showNext();
    }


    /**
     * add tweet to the list
     * @param   object  tweet_data
     */
    function addTweet( data ) {
        if(data.id <= _last_tweet_id) {
            return;
        }

        // store highest twitter ID
        _last_tweet_id = Math.max(data.id, _last_tweet_id);

        // wrap hashtags and usernames with a span tag
        data.html = data.text.replace(/(#|@)[a-zA-Z0-9_]+/g, function(match, type) {
            var className = (type == '@') ? 'username' : 'hashtag';
            return '<span class="'+ className +'">'+ match +'</span>';
        });

        $.tmpl("<li>"+ options.tweet_template +"</li>", data)
            .appendTo(options.list);
    }


    /**
     * generate style tag
     * @param name
     * @param value
     * @return {*}
     */
    function generateStyle() {
        if(_style_tag) {
            _style_tag.remove();
        }

        _style_tag = $.tmpl("<style type='text/css'>"+ options.style_template +"</style>", options)
            .appendTo("head");
    }


    /**
     * option getter and setter
     * @param   string  name
     * @param   mixed   value
     * @return  mixed   value
     */
    function option( name, value ) {
        // getter
        if(typeof(value) == 'undefined') {
            return options[name];
        }

        // setter
        switch(name){
            case 'effect':
                if(Effect[value]) {
                    if (Effect[value] != options.effect) {
                        if(typeof(options.effect) == 'object')
                            options.effect.destroy();

                        options.effect = Effect[value];
                        options.effect.setup(container, options.list);
                    }
                }
                break;

            case 'search':
                options[name] = value;
                _last_tweet_id = 0;
                break;

            case 'bg_color':
            case 'bg_image':
            case 'tweets_bg':
            case 'tweets_color':
            case 'font_face':
                options[name] = value;
                generateStyle();
                break;

            default:
                options[name] = value;
                break;
        }


        return options[name];
    }

    /**
     * Mass assignment of options
     */
    function settings (opts) {
        $.each(opts, function (k, v) {
            option(k, v);
        });
    }

    /**
     * Remove current set of Tweets
     */
    function clear() {
        options.list.empty();
    }

    return {
        getTweets: getTweets,
        animateTweets: animateTweets,
        option: option,
        settings: settings,
        clear: clear
    };
}
