if (typeof(Client) == "undefined") Client = {};


// Constructor
Client.Chat = function(user) {
	this.user = user;
	user.socket.on('message', bind(this, this.onMessage));
};

// key used in message passing so that we can filter out messages addressed only to us
Client.Chat.MSG_KEY = "Chat";


Client.Chat.prototype = {
	onMessage: function(obj) {
		// We're only interested in messages with our key
		if (obj.key != Client.Chat.MSG_KEY) return;
		
		if (obj.method) {
			this[obj.method].call(this, obj.data);
		}
	},
	
	initChat: function(buffer) {
		document.getElementById('form').style.display='block';
		document.getElementById('chat').innerHTML = '';
		
		$('#text').focus();

		for (var i in buffer) this.appendMessage(buffer[i]);
		
		this.restoreName();
	},
	
	restoreName: function() {
		var savedName = $.cookie('name');
		if (!savedName) return;
		
		this.handleUserCommand("name", savedName);
	},
	
	appendMessage: function(obj) {
		var el = document.createElement('p');
		if ('announcement' in obj) el.innerHTML = '<em>' + this.esc(obj.announcement) + '</em>';
		else if ('message' in obj) el.innerHTML = '<b>' + this.esc(obj.message[0]) + ':</b> ' + this.esc(obj.message[1]);
		document.getElementById('chat').appendChild(el);
		document.getElementById('chat').scrollTop = 1000000;
	},
	
	onGameReload: function(secsToWait) {
		var secsToWait = secsToWait || 3;
		
		var chat = this;
		var ticker = function() {
			chat.appendMessage({announcement: "Reloading in " + secsToWait + "..."});
			secsToWait--;
			secsToWait < 1 ? window.location.reload() : setTimeout(ticker, 1000);
		};
		
		setTimeout(ticker, 1000);
	},
	
	send: function() {
		var val = document.getElementById('text').value;
		var matchData = val.match(/^!([^ ]+) ?(.+)?/);
		
		if (matchData) {
			this.handleUserCommand(matchData[1], matchData[2]);
		} else {
			this.payload("chatMessage", val);
			this.appendMessage({message: ['you', val] });
		}
		
		document.getElementById('text').value = '';
	},
	
	handleUserCommand: function(cmd, arg) {
		this.payload("cmd_" + cmd, arg);
		
		switch(cmd) {
			case 'name':
				// Save the user's name so that we can re-use it in the next session
				$.cookie('name', arg, {expires: 365});
				break;
		}
	},
	
	esc: function(msg) {
		return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	},
	
	payload: function(method, data) {
		this.user.payload(Client.Chat.MSG_KEY, method, data);
	},
}
