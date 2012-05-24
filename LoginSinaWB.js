var Browser = require('zombie'),
http = require('http'),
assert = require('assert'),
base64 = require('./base64'),
querystring = require('querystring'),
sha1 = require('sha1'),
browser = new Browser();

exports.login = function(username, password, callback) {
	var userbase64 = base64.encode(encodeURIComponent(username));

	browser.visit("http://login.sina.com.cn/sso/prelogin.php?entry=miniblog&callback=sinaSSOController.preloginCallBack&user=" + userbase64 + "&client=ssologin.js(v1.3.16)", function() {
		var sinaSSOController = {
			preloginCallBack: function(source) {
				return source;
			}
		};
		var jscode = browser.document.body.innerHTML;
        //console.log(jscode);
		var data = eval(jscode);
		var sp = sha1(sha1(sha1(password)) + data.servertime + data.nonce);
		var post_data = querystring.stringify({
			encoding: 'UTF-8',
			entry: 'weibo',
			from: '',
			gateway: 1,
			nonce: data.nonce,
			prelt: 625,
			pwencode: 'wsse',
			returntype: 'META',
			savestate: 7,
			servertime: data.servertime,
			service: 'miniblog',
			sp: sp,
			ssosimplelogin: 1,
			su: userbase64,
			url: 'http://weibo.com/ajaxlogin.php?framelogin=1&callback=parent.sinaSSOController.feedBackUrlCallBack',
			useticket: 1,
			vsnf: 1
		});
		var post_req = http.request({
			host: 'login.sina.com.cn',
			port: 80,
			path: '/sso/login.php?client=ssologin.js(v1.3.22)',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': post_data.length
			}
		},
		function(res) {
			res.setEncoding('utf8');
			var jscode = '';
			res.on('data', function(chunk) {
				jscode += chunk;
			});
			res.on('end', function() {
				var Cookies_url = jscode.match(/replace\(\'(.*?)\'\)/)[1];
				browser.visit(Cookies_url, function() {
                    console.log('登陆成功');
					var cookies = browser.saveCookies();
					browser.loadCookies(cookies);
					if (callback) callback(null, browser);
				});
			});
		});
		post_req.on('error', function(e) {
			if (callback) callback(e);
		});
		post_req.write(post_data);
		post_req.end();
	});
};

