require('board');

var util = require('utilities');

SetGame = function(options) {
	this.options = options;
	this.options.mode = this.options.mode || 'easy';
	
	this.board = null;
	
	this.resetBoard();
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
	resetBoard: function() {
		var opts = SetGame.MODES[this.options.mode];
		this.board = new Board(opts);
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
			this[obj.method].call(this, obj.data);
		}
	},
	
	verify: function(indices) {
		var board = this.game.board, user = this.user;
		var result = board.verify(indices);
		
		if (true || result) {
			user.score++;
			user.announce("got a set!");
			
			if (board.deck.length < indices.length) {
				// If we run out of cards, reset the board
					this.game.resetBoard();
					
			} else {
				// Otherwise, replace the set cards with new ones from the deck
				indices.forEach(function(idx){
					board.cards[idx] = board.deck.shift();
				});
			}
		}
		
		this.payload("verifyResult", {
			result: result,
			board: board,
			score: this.user.score
		});
		this.broadcast("initBoard", board);
	},
	
	cmd_userSelect: function(cellIdx) {
		this.broadcast("userSelect", cellIdx);
	},
	
	payload: function(method, data) {
		this.user.send(this.getPayload(method, data));
	},
	
	broadcast: function(method, data) {
		this.user.broadcast(this.getPayload(method, data));
	},
	
	getPayload: function(method, data) {
		var payload = {
			key: SetGame.MSG_KEY,
			method: method,
			data: data
		};
		
		return payload;
	}
}