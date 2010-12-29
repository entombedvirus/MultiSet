var util  = require('utilities'),
	chat    = require('chat'),
	game    = require('set_game').
	lb      = require('leaderboard');

User = function(client) {
	this.client = client;
	
	client.on('disconnect', util.bind(this, this.onDisconnect));
	
	this.chatHandler = this.gameHandler = null;
	this.score = 0;
	this.name = "(anon: " + client.sessionId + ")";
}

User.prototype = {
	onDisconnect: function() {
		this.announce("disconnected!");
		this.leaderboard.removeUser(this);
	},
	
	bindChat: function(chat) {
		this.chat = chat;
		this.chatHandler = new Chat.ClientHandler(this, chat);
		this.announce("disconnected!");
		
		return this.chatHandler;
	},
	
	bindGame: function(game) {
		this.game = game;
		return this.gameHandler = new SetGame.ClientHandler(this, game);
	},
	
	bindLeaderboard: function(lb) {
		this.leaderboard = lb;
		lb.addUser(this);
	},
	
	broadcastLeaderboard: function() {
		this.leaderboard && this.leaderboard.broadcast(this);
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

	toTO: function() {
		var obj = {
			name: this.name,
			score: this.score,
			id: this.getId()
		};
		
		return obj;
	},
	
	payload: function(routingKey, method, data) {
		this.client.send(this.getPayload(routingKey, method, data));
	},
	
	broadcast: function(routingKey, method, data) {
		this.client.broadcast(this.getPayload(routingKey, method, data));
	},
	
	getPayload: function(routingKey, method, data) {
		var payload = {
			key: routingKey,
			method: method,
			data: data
		};
		
		return payload;
	}
}

