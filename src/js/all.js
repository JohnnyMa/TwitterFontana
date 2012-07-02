var wall = new Wall("#tweets", settings.getCurrentSettings());

$('.settings').click(function (e) {
	e.preventDefault(); settings.toggleSettings();
});

$('.fullscreen').click(function (e) {
	e.preventDefault(); utils.requestFullscreen(document.getElementById('tweets'));
});

$('#settingsForm').submit(function (e) {
	e.preventDefault(); applySettings();
});

function applySettings () {
	wall.clear();
	wall.settings(settings.getCurrentSettings());
	$("#settings input[name=settings_url]").val(settings.generateSettingsUrl());
	wall.getTweets(function() {
	    wall.animateTweets();
	});
}
applySettings();
