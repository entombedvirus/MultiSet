var url = require('url')
, fs    = require('fs')
, env   = require(__dirname + '/../config/env');

HttpServer = {};

HttpServer.serverCallback = function(req, res) {
	var path = url.parse(req.url).pathname;
	switch (path){
		case '/':
		path = '/index.html';
		// pass through
		
		case '/js/json.js':
		case '/js/client.chat.js':
		case '/js/client.set_game.js':
		case '/js/client.logger.js':
		case '/js/client.user.js':
		case '/js/client.countdown.js':
		case '/js/sprintf-0.7-beta1.js':
		case '/index.html':
		fs.readFile(env.PUBLIC_DIR + path, function(err, data){
			if (err) return send404(res);
			res.writeHead(200, {'Content-Type': path.match(/\.js$/) ? 'text/javascript' : 'text/html'})
			res.write(data, 'utf8');
			res.end();
		});
		break;

		default: send404(res);
	}
}

send404 = function(res){
	res.writeHead(404);
	res.write('404');
	res.end();
};
