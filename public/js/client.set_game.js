if (typeof(Client) == "undefined") Client = {};

// Constructor
Client.SetGame = function(socket) {
	this.socket = socket;
	this.socket.on('message', bind(this, this.onMessage));
	this.frozen = false;
};

// key used in message passing so that we can filter out messages addressed only to us
Client.SetGame.MSG_KEY = "SetGame";


Client.SetGame.prototype = {
	onMessage: function(obj) {
		// We're only interested in messages with our key
		if (obj.key != Client.SetGame.MSG_KEY) return;
		
		if (obj.method) {
			console.log("Response: ", obj.key, obj.method, obj.data);
			this[obj.method].call(this, obj.data);
		}
	},
	
	initBoard: function(board) {
		$('#board').html("");
		
		var table = $('<table></table>');
		
		for (var i=0; i < board.rows; i++) {
			var tr = $('<tr></tr>');
			for (var j=0; j < board.cols; j++) {
				var td = $('<td align="center"></td>');
				var card = board.cards[this.flattenIdx(i, j)];
				td.data('cardIdx', this.flattenIdx(i, j));
				td.append(this.toText(card));
				tr.append(td);
			};
			
			table.append(tr);
		};
		
		table.click(bind(this, this.onBoardClick));
		
		$('#board').append(table);
	},
	
	onBoardClick: function(e) {
		if (this.frozen) return;
		
		var target = $(e.target);
		var td = target.closest('td');
		var cellNum = td.data('cardIdx');
		
		this.payload("cmd_userSelect", cellNum);
		
		td.removeClass('selected_other').toggleClass('selected');
		
		var tds = $('#board td.selected');
		
		var userSelections = tds.map(function(idx, col) { return $(col).data('cardIdx') });
		
		if (userSelections.length > 2) this.verifyUserSelection(userSelections.toArray());
	},
	
	verifyUserSelection: function(indices) {
		this.frozen = true;
		this.payload("verify", indices);
	},
	
	verifyResult: function(data) {
		$('#board td').removeClass('selected');
		this.frozen = false;
		if (data.board) this.initBoard(data.board);
	},
	
	userSelect: function(cellIdx) {
		var td = $('#board td').get(cellIdx);
		$(td).toggleClass('selected_other');
	},
	
	payload: function(method, data) {
		var payload = {
			"key": Client.SetGame.MSG_KEY,
			"method": method,
			"data": data
		}
		
		console.log("Request: ", payload.key, payload.method, payload.data);
		
		socket.send(payload);
	},
	
	flattenIdx: function(row, col) {
		return row * 3 + col;
	},
	
	toText: function(card) {
		var span = $('<span class="card"></span>').
			addClass("shape_" + card.shape).
			addClass("color_" + card.color).
			addClass("texture_" + card.texture).
			addClass("number_" + card.number);
		
		switch(card.shape) {
			case 'pill':
				span.html("&para;");
				break;
				
			case 'squiggly':
				span.html('&xi;');
				break;
				
			case 'diamond':
				span.html('&diams;');
				break;
		}
		
		span.text(new Array(card.number + 1).join(span.text()));
		
		return span;
	}
}
