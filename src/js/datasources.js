/**
= Fontana Datasources =

There are three different types of Datasources:

 * Fontana.datasources.Static
 * Fontana.datasources.Twitter
 * Fontana.datasources.HTML

The datasource interface consist of the constructor taking one parameter.

The datastore provides an instance method `getMessages` that will trigger
a 'messages' event every time there are new messages.

Consumers can listen to the `messages` event by binding a callable that
takes one parameter, an array of messages.

Each datasource has a `stop` method. Calling this method will stop
the datasource from refreshing. This methods is a no-op for the Static
and HTML datasource, since they don't refresh anyway.

Calling `getMessags` will restart a stopped datasource.

== Static ==

A static datasource simply takes a hardcoded array of messages.

The messages themselves are javascript objects modeled after the JSON
response objects returned by http://search.twitter.com/search.json.

The following object describes a bare bones message:

    {
       'created_at': new Date().toString(),
       'text': 'A fake Tweet, in a fake JSON response',
       'from_user': 'tweetfontana',
       'profile_image_url': 'http://api.twitter.com/1/users/profile_image/tweetfontana'
   }

The static datasource will only trigger the `messages` event after
calling `getMessages`. Updating the set of messags is not supported.

== Twitter ==

The Twitter datasource takes a query that's used for
http://search.twitter.com/search.json.

Repeated calls to the datasource will return the most recent set of
tweets for the configured query.

After calling `getMessages` this datasource will poll Twitter for
new messages, triggering the `messages` event each time there are new
messages.

== HTML ==

Given a HTML node this datasource will try to find messages 
by looking for the following HTML:

    div class="fontana-message">
        <q>This is not a real Tweet, but it sure looks like one.</q>
        <cite>tweetfontana</cite>
    </div>

This is only done once on initialisation, this means that the HTML
datasource triggers the `messages` event each time `getMessages`
is called but will not detect any new messages added to the container.
*/


var Fontana = window.Fontana || {};


Fontana.datasources = (function ($) {
    var Static, Twitter, HTML;

    /**
     * Static datasource.
     *
     * Constructor takes an array of message objects.
     */
    Static = function (data) {
        this.data = data;
    };

    Static.prototype.getMessages = function () {
        this.trigger('messages', this.data);
    };

    Static.prototype.stop = function () {};

    window.MicroEvent.mixin(Static);


    /**
     * Twitter datasource
     *
     * Constructor takes a query for Twitter's search API.
     */
    Twitter = function (q) {
        this.transformResponse = false;
        this.params = {
            'since_id': 1
        }
        if (q.indexOf('favorites:') == 0 && q.split('favorites:').length > 1) {
            this.params.screen_name = q.split('favorites:')[1].split(' ')[0];
            this.search_url = 'http://api.twitter.com/1/favorites.json?callback=?';
            this.transformResponse = true;
        } else {
            this.search_url = 'http://search.twitter.com/search.json?result_type=recent&callback=?';
            this.params.q = q
        }
        this.refreshTimeout = null;
    };

    Twitter.prototype.getMessages = function () {
        var self = this;
        $.getJSON(this.search_url, this.params, function (data, status) {
            var results;
            if (status === 'success') {
                if (self.transformResponse) {
                    results = self.transformMessages(data);
                } else {
                    results = data.results;
                }
                if (results && results.length) {
                    self.updateSinceId(results);
                    self.trigger('messages', results);
                }
            }
            self.refreshTimeout = window.setTimeout(function () {
                self.getMessages.call(self)
            }, 45 * 1000);
        });
    };

    /**
     * Covert the messages objects from the Twitter API response
     * to the Twitter Search response format.
     */
    Twitter.prototype.transformMessages = function (messages) {
        return $.map(messages, function (message) {
            var returnValue = $.extend({}, message);
            returnValue.from_user = message.user.screen_name;
            returnValue.profile_image_url = message.user.profile_image_url;
            return returnValue;
        });
    };

    Twitter.prototype.stop = function () {
        window.clearTimeout(this.refreshTimeout);
    };

    Twitter.prototype.updateSinceId = function (messages) {
        this.params.since_id = messages[0].id_str;
    };

    window.MicroEvent.mixin(Twitter);


    /**
     * HTML datasource
     *
     * Constructor takes a html node with "Tweets".
     */
     HTML = function (node) {
        this.node = node;
        this.data = [];
        this.parseMessages();
     };

     HTML.prototype.parseMessages = function () {
        var self = this;
        $('.fontana-message', this.node).each(function () {
            self.data.push({
                'created_at': new Date().toString(),
                'text': $(this).find('q').text(),
                'from_user': $(this).find('cite').text(),
                'profile_image_url': 'http://api.twitter.com/1/users/profile_image/' + $(this).find('cite').text()
            });
        });
     };

     HTML.prototype.getMessages = function () {
        this.trigger('messages', this.data);
     };

    HTML.prototype.stop = function () {};

    window.MicroEvent.mixin(HTML);


    return {
        'Static': Static,
        'Twitter': Twitter,
        'HTML': HTML
    };

}(window.jQuery));
