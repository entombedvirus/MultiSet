var util  = require('utilities'),
	chat    = require('chat'),
	game    = require('set_game');

User = function(client) {
	this.client = client;
	this.chatHandler = this.gameHandler = null;
	this.score = 0;
	this.name = "(anonymous: " + client.sessionId + ")";
}

User.prototype = {
	bindChat: function(chat) {
		return this.chatHandler = new Chat.ClientHandler(this, chat);
	},
	
	bindGame: function(game) {
		return this.gameHandler = new SetGame.ClientHandler(this, game);
	},
	
	getId: function() {
		return this.client.sessionId;
	},
	
	getName: function() {
		return this.name;
	},
	
	announce: function(msg) {
		this.chatHandler.announce(msg);
	},
	
	send: function(data) {
		this.client.send(data);
	},
	
	broadcast: function(data) {
		this.client.broadcast(data);
	}
}

