var url = require('url')
  , fs = require('fs')
  , util = require('utilities');;

// Constructor
Chat = function() {
	this.buffer = [];
};

// key used in message passing so that we can filter out messages addressed only to us
Chat.MSG_KEY = "Chat";

Chat.ClientHandler = function(user, chat) {
	this.user = user;
	this.chat = chat;
	this.onConnect();
	user.client.on('message', util.bind(this, this.onMessage));
}

Chat.ClientHandler.prototype = {
	onConnect: function() {
		this.payload("initChat", this.chat.buffer);
		this.payload("appendMessage", {
			announcement: "Welcome to MultiSet, where you can play the game of Set with your friends in *real time*!"
		});
		this.payload("appendMessage", {
			announcement: "Type !name <your name> to change your name."
		});
	},
	
	onMessage: function(obj) {
		if (obj.key != Chat.MSG_KEY) return;
		
		if (obj.method) {
			if (typeof(this[obj.method]) == "function")
				this[obj.method].call(this, obj.data);
			else
				console.error("Don't know how to handle", obj.key, obj.method);
		}
	},
	
	announce: function(msg) {
		this.payload("appendMessage", {announcement: ("you " + msg)});
		this.broadcast("appendMessage", {announcement: (this.user.getName() + " " + msg)});
	},
	
	chatMessage: function(msg) {
		this.broadcast("appendMessage", {message: [this.user.getName(), msg]});
	},
	
	cmd_name: function(name) {
		this.user.announce("changed name to " + name);
		this.user.name = name;
	},

	cmd_reload: function(waitTime) {
		waitTime = waitTime || 3;
		
		this.user.announce("scheduled a reload of the game. Please wait while I restart...");
		
		this.payload("onGameReload", waitTime);
		this.broadcast("onGameReload", waitTime);
		setTimeout(function() { process.exit(1) }, waitTime);
	},
	
	cmd_cheat: function() {
		this.user.announce("just cheated!");
		
		var sols = this.user.game.getSolutions();
		
		var msg = "are looking for these: ";
		sols.forEach(function(sol) { msg += '[' + sol.join(', ') + '] ' });
		
		this.user.announce(msg);
	},
	
	payload: function(method, data) {
		this.user.payload(Chat.MSG_KEY, method, data);
	},
	
	broadcast: function(method, data) {
		this.user.broadcast(Chat.MSG_KEY, method, data);
	},
}