# TwitterFontana #

An open-source alternative for those Flash based Twitter Fountains, built
using HTML5, CSS (SASS) and Javascript.

- [See and use it at TwitterFontana.com](http://www.twitterfontana.com/)
- [Follow us on Twitter](https://twitter.com/#!/tweetfontana)
- [Facebook page](https://www.facebook.com/twitterfontana)

## Quick start ##

Assuming you've got all the scripts loaded, running a custom Fontana is

    // Search Twitter for #twitterfontana
    var data = new Fontana.datasources.Twitter('#twitterfontana'); 
    // Default settings
    var settings = new Fontana.config.Settings();
    // Setup the GUI and draw it in the selected HTML element
    var fontana = new Fontana.GUI(data, settings);
    fontana.start($('#twitter-fontana'));

## Fullscreen ##

Fullscreen mode uses the new HTML5 fullscreen API. Fontana comes with a
simple wrapper (this method only works if it's called from a click or
key event).

    Fontana.utils.requestFullscreen(document.getElementById('twitter-fontana'));

Note that the fullscreen API is currently only implemented in Gecko and WebKit
based browsers (Firefox, Chrome, Safari and some lesser known browsers).

## Datasources ##

Getting messages from Twitter is cool and all, but what if you want to show a
specific set of pre-written messages? That's possible by using one of these
alternative datasources.

### HTML datasource ###

The HTML datasource loads messages from an HTML element. The Twitter Fontana
site uses this datasource on the homepage.

This HTML snippet is a perfectly valid datasource:

    <div id="fontana-data">
        <div class="fontana-message">
            <q>This is not a real Tweet, but it sure looks like one.</q>
            <cite>tweetfontana</cite>
        </div>
        <div class="fontana-message">
            <q>Just some text and a username is enough.</q>
            <cite>tweetfontana</cite>
        </div>
    </div>

Just set up the HTML datasource and Fontana will cycle through those two
messages indefinitely:

    var data = new Fontana.datasources.HTML('#fontana-data');
    var fontana = new Fontana.GUI(data, new Fontana.config.Settings());

### Static datasource ###

The static datasource takes an array of objects. These objects contain a 
subset of the fields returned in a Twitter search JSON response.
Setting up Fontana with this datasource looks like this:

    var data = new Fontana.datasources.Static([{
                   'created_at': new Date().toString(),
                   'text': 'A fake Tweet, in a fake JSON response',
                   'from_user': 'tweetfontana',
                   'profile_image_url': 'http://api.twitter.com/1/users/profile_image/tweetfontana'
               })];
    var fontana = new Fontana.GUI(data, new Fontana.config.Settings());

## Settings ##

The following settings are available

`data_refresh_interval`
Interval between fetching data from the datasource (in miliseconds).

`message_animate_interval`
The amount of time a message is shown (in miliseconds).

`message_template`
jQuery template string for displaying the messages

`twitter_search`
Search twitter for this string. Changing this setting for an existing Fontana
instance will change the datasource to Twitter, regardless of what it was
initialized with!

`effect`
The effect is used to transition between the messages. Current built in effects
are Fade, Slide and Zoom.

### Styling the messages ###

The messages are styled using CSS. The following settings mostly exist
so the 'wizard' can do it's magic.

`font-face` 
Font used in the messages

`text_color`
Color of the messages

`special_color`
Color of the hashtags and usernames

`bg_color`
Background color of the container

`bg_image`
Background image of the container

`box_bg`
Background color of the message container

## Further notes

Created by Jaap Roes, Jorik Tangelder and Arjen Scherff-de Water
at [Eight Media](http://www.eight.nl/) in Arnhem, the Netherlands.
