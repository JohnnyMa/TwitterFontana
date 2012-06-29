var wall = new Wall("#tweets", settings.getCurrentSettings());

function applySettings () {
	wall.clear();
	wall.settings(settings.getCurrentSettings());
	$("#settings input[name=settings_url]").val(settings.generateSettingsUrl());
	wall.getTweets(function() {
	    wall.animateTweets();
	});
}
applySettings();
