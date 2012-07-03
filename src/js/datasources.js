/**
= Fontana Datasources =

There are two different types of Datasources:

 * Fontana.datasources.Static
 * Fontana.datasources.Twitter

The datasource interface consist of the constructor taking one parameter.

The datastore provides an instance method that takes a callback that will
recieve the latest messages.

== Static ==

A static datasource simply takes a hardcoded array of messages.

The messages themselves are javascript objects modeled after the JSON
response objects returned by http://search.twitter.com/search.json.

== Twitter ==

The Twitter datasource takes a query that's used for
http://search.twitter.com/search.json.

Repeated calls to the datasource will return the most
recent set of tweets for the configured query.
*/


var Fontana = window.Fontana || {};


Fontana.datasources = (function ($) {
	var Static, Twitter;

	/**
	 * Static datasource.
	 *
	 * Constructor takes an array of message objects.
	 */
	Static = function (data) {
		this.data = data;
	};

	Static.prototype.getMessages = function (callback) {
		callback(this.data);
	};


	/**
	 * Twitter datasource
	 *
	 * Constructor takes a query for Twitter's search API.
	 */
	Twitter = function (q) {
		this.search_url = 'http://search.twitter.com/search.json?result_type=recent&include_entities=true&callback=?';
		this.q = q;
		this.data = [];
	};

	Twitter.prototype.getMessages = function (callback) {
		$.getJSON(this.search_url, {q: this.q}, function (data, status) {
            if (status === 'success') {
                callback(data.results);
            }
        });
	};

	return {
		'Static': Static,
		'Twitter': Twitter
	};

}(window.jQuery));
