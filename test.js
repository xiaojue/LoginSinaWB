var LoginSinaWB = require('./LoginSinaWB');

LoginSinaWB.login('username', 'password', function(err, browser) {
	if (!err) {
		browser.visit('http://www.weibo.com', function() {
			browser.wait(function() {
				console.log(browser.location.href);
			});
		});
	}
});

