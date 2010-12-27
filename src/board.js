require('card');

// Constructor
Board = function(options) {
	this.rows = options.rows;
	this.cols = options.cols;
	this.attributes = options.attributes;
	this.deck = null;
	
	this.generate();
}

Board.ATTRIBUTES = {
	color: ['red', 'green', 'purple'],
	shape: ['pill', 'squiggly', 'diamond'],
	number: [1, 2, 3],
	texture: ['filled', 'striped', 'empty']
}

Board.prototype = {
	generateFullDeckEasy: function() {
		var cards = new Array();
		
		Board.ATTRIBUTES.color.forEach(function(color) {
			Board.ATTRIBUTES.shape.forEach(function(shape) {
				Board.ATTRIBUTES.number.forEach(function(number) {
					var card = new Card;
					card.color = color;
					card.shape = shape;
					card.number = number;

					cards.push(card);
				});
			});
		});
		
		return cards;
	},
	
	generateFullDeckHard: function() {
		var cards = new Array();

		Board.ATTRIBUTES.color.forEach(function(color) {
			Board.ATTRIBUTES.shape.forEach(function(shape) {
				Board.ATTRIBUTES.number.forEach(function(number) {
					Board.ATTRIBUTES.texture.forEach(function(texture) {
						var card = new Card;
						card.color = color;
						card.shape = shape;
						card.number = number;
						card.texture = texture;

						cards.push(card);
					});
				});
			});
		});

		return cards;
	},
	
	generate: function() {
		this.deck = this.attributes.length < 4 ? this.generateFullDeckEasy() : this.generateFullDeckHard();
		this.deck.shuffle();
		
		this.cards = this.deck.splice(0, this.rows * this.cols);
	},
	
	verify: function(indices) {
		var validSet = true;
		var userChoices = [];
		var board = this;
		
		indices.forEach(function(idx) { userChoices.push(board.cards[idx]) });
		
		this.attributes.forEach(function(attribute) {
			var attributeValues = userChoices.map(function(card) { return card[attribute]} ).unique();
			
			var isSame = attributeValues.length == 1;
			var isDifferent = attributeValues.length == indices.length;
			
			validSet &= (isSame || isDifferent);
		})
		
		return validSet;
	}
}