require('board');

var util = require('utilities');

SetGame = function(options) {
	this.options = options;
	this.options.mode = this.options.mode || 'easy';
	
	var opts = SetGame.MODES[this.options.mode];
	this.board = new Board(opts);
}

// key used in message passing so that we can filter out messages addressed only to us
SetGame.MSG_KEY = "SetGame";

SetGame.MODES = {
	'easy': {
		rows: 3,
		cols: 3,
		attributes: ['color', 'shape', 'number']
	},
	
	'hard': {
		rows: 4,
		cols: 3,
		attributes: ['color', 'shape', 'number', 'texture']
	},
}

SetGame.prototype = {
	getSolutions: function() {
		return this.board.
			getSolutions().map(function(indices) {
				return indices.map(function(idx) { return idx + 1 });
			});
	},
}

SetGame.ClientHandler = function(user, game) {
	this.user = user;
	this.game = game;
	
	this.onConnect();
	user.client.on('message', util.bind(this, this.onMessage));
}

SetGame.ClientHandler.prototype = {
	onConnect: function() {
		this.payload("initBoard", this.game.board);
	},
	
	onMessage: function(obj) {
		if (obj.key != SetGame.MSG_KEY) return;
		
		if (obj.method) {
			if (typeof(this[obj.method]) == "function")
				this[obj.method].call(this, obj.data);
			else
				console.error("Don't know how to handle", obj.key, obj.method);
		}
	},
	
	verify: function(indices) {
		var board = this.game.board, user = this.user;
		var result = board.verify(indices);
		
		if (result) {
			user.score++;
			user.announce("got a set!");
			
			if (board.deck.length < indices.length) {
				// If we run out of cards, reset the board
					board.reset();
					
			} else {
				// Otherwise, replace the set cards with new ones from the deck
				indices.forEach(function(idx){
					board.cards[idx] = board.deck.shift();
				});
				if (board.numSolutions() < 1) board.reset();
			}
		}
		
		this.payload("verifyResult", {
			result: result,
			board: board,
			score: this.user.score
		});
		this.broadcast("initBoard", board);
		this.user.broadcastLeaderboard();
	},
	
	cmd_userSelect: function(cellIdx) {
		this.broadcast("userSelect", cellIdx);
	},
	
	payload: function(method, data) {
		this.user.payload(SetGame.MSG_KEY, method, data);
	},
	
	broadcast: function(method, data) {
		this.user.broadcast(SetGame.MSG_KEY, method, data);
	},
}