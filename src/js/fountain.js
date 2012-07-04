$(function () {
	var settings,settingsGUI, data, fontana;

    // Create the settings and the settings panel
    settings = new Fontana.config.Settings();
    settingsGUI = new Fontana.config.SettingsGUI($('footer'), settings);
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

    // Select the settings url on click
    $('#settings_url').bind('click', function () {
        $(this).select();
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
