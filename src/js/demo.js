(function () {
	var data = new Fontana.datasources.HTML($('#twitter-fontana'));
	var staticFontana = new Fontana.GUI(data, new Fontana.config.Settings());
	staticFontana.start($('#twitter-fontana'));

    // Make fullscreen buttons work
    $('.fullscreen').click(function (e) {
        e.preventDefault();
        Fontana.utils.requestFullscreen(document.getElementById('twitter-fontana'));
    });
}());

WebFontConfig = {
    google: { families: ['Open+Sans:400,600:latin,latin-ext'] }
};
(function() {
    var wf = document.createElement('script');
    wf.src = 'http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
}());
