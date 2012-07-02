var wall = new Wall("#tweets", settings.getCurrentSettings());

function applySettings () {
	wall.clear();
	wall.settings(settings.getCurrentSettings());
	$("#settings input[name=settings_url]").val(settings.generateSettingsUrl());
	wall.getTweets(function() {
	    wall.animateTweets();
	});
}

(function () {
	// Make settings buttons toggle the settings panel
	$('.settings').click(function (e) {
		e.preventDefault();
		settings.toggleSettings();
	});

	// Make fullscreen buttons work
	$('.fullscreen').click(function (e) {
		e.preventDefault();
		utils.requestFullscreen(document.getElementById('tweets'));
	});

	// Apply the settings when the settings form is submitted
	$('#settingsForm').submit(function (e) {
		e.preventDefault();
		applySettings();
	});

	// Select the settings url on click
	$('#settings_url').bind('click', function () {
		$(this).select();
	});

	applySettings();
})();
