var wall = new Wall("#tweets", settings.getCurrentSettings());

function resetWall() {
	wall.clear();
	wall.getTweets(function() {
	    wall.animateTweets();
	});
}

function applySettings () {
	wall.settings(settings.getCurrentSettings());
	$("#settings input[name=settings_url]").val(settings.generateSettingsUrl());
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

	// Apply the settings and reset the wall when the settings form is submitted
	$('#settingsForm').submit(function (e) {
		e.preventDefault();
		applySettings();
		resetWall();
	});

	// Apply the settings when the appearance form is submitted
	$('#appearanceForm').submit(function (e) {
		e.preventDefault();
		applySettings();
	});

	// Select the settings url on click
	$('#settings_url').bind('click', function () {
		$(this).select();
	});

	$("input, select", $('#settingsForm')).change(function () {
		$('#settingsForm').submit();
	});

	$("input, select", $('#appearanceForm')).change(function () {
		$('#appearanceForm').submit();
	});

	applySettings();
	resetWall();
})();
