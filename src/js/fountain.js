/**
 * A Twitter Fontana with a settings panel and fullscreen option.
 */

$(function () {
    var settings,settingsGUI, data, fontana;

    // Create the settings and the settings panel
    settings = new Fontana.config.Settings();
    settingsGUI = new Fontana.config.SettingsGUI($('footer'), settings);
    if (window.location.search) {
        settingsGUI.loadSettingsFromUrl();
    }
    settingsGUI.draw();

    // Setup the actual fountain
    data = new Fontana.datasources.Twitter(settings.get('twitter_search'));
    fontana = new Fontana.GUI(data, settings);
    fontana.start($('#twitter-fontana'));

    // Make settings buttons toggle the settings panel
    $('a.settings').live('click', function (e) {
        e.preventDefault();
        settingsGUI.toggle();
    });

    // Make fullscreen buttons work
    $('.fullscreen').click(function (e) {
        e.preventDefault();
        Fontana.utils.requestFullscreen(document.getElementById('twitter-fontana'));
    });
});

WebFontConfig = {
    google: { families: ['Open+Sans:400,600:latin,latin-ext',
                         'Crete Round::latin,latin-ext',
                         'Enriqueta::latin,latin-ext',
                         'Exo::latin,latin-ext',
                         'Handlee::latin,latin-ext',
                         'Imprima::latin,latin-ext'] }
};
(function() {
    var wf = document.createElement('script');
    wf.src = 'http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
}());

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-30289566-2']);
_gaq.push(['_setDomainName', 'twitterfontana.com']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'http://www.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var _gauges = _gauges || [];
(function() {
    var t   = document.createElement('script');
    t.type  = 'text/javascript';
    t.async = true;
    t.id    = 'gauges-tracker';
    t.setAttribute('data-site-id', '4ffc0f6ff5a1f54c9f00003c');
    t.src = '//secure.gaug.es/track.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(t, s);
})();
