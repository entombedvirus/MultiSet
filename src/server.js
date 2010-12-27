var env = require('./../config/env');

var http = require('http'),
		io   = require ('socket.io');

['http_server', 'user', 'chat', 'set_game'].forEach(function(f) {
	require(f);
})

var port   = 8124;

var server = http.createServer(HttpServer.serverCallback);
server.listen(port);

var socket = io.listen(server);

var chat = new Chat;
var game = new SetGame({
	mode: 'easy'
});

socket.on('connection', function(client) {
	var user = new User(client);
	user.bindChat(chat);
	user.bindGame(game);
})

console.log("Server running at localhost:", port);