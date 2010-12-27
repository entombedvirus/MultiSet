if (typeof(Client) == "undefined") Client = {};


// Constructor
Client.Chat = function(socket) {
	this.socket = socket;
	this.socket.on('message', bind(this, this.onMessage));
};

// key used in message passing so that we can filter out messages addressed only to us
Client.Chat.MSG_KEY = "Chat";


Client.Chat.prototype = {
	onMessage: function(obj) {
		// We're only interested in messages with our key
		if (obj.key != Client.Chat.MSG_KEY) return;
		
		if (obj.method) {
			console.log("Response: ", obj.key, obj.method, obj.data);
			this[obj.method].call(this, obj.data);
		}
	},
	
	initChat: function(buffer) {
		document.getElementById('form').style.display='block';
		document.getElementById('chat').innerHTML = '';
		
		$('#text').focus();

		for (var i in buffer) this.appendMessage(buffer[i]);
	},
	
	appendMessage: function(obj) {
		var el = document.createElement('p');
		if ('announcement' in obj) el.innerHTML = '<em>' + this.esc(obj.announcement) + '</em>';
		else if ('message' in obj) el.innerHTML = '<b>' + this.esc(obj.message[0]) + ':</b> ' + this.esc(obj.message[1]);
		document.getElementById('chat').appendChild(el);
		document.getElementById('chat').scrollTop = 1000000;
	},
	
	send: function() {
		var val = document.getElementById('text').value;
		var matchData = val.match(/^!(.+) (.+)/);
		
		if (matchData) {
			this.payload("cmd_" + matchData[1], matchData[2]);
		} else {
			this.payload("chatMessage", val);
			this.appendMessage({message: ['you', val] });
		}
		
		document.getElementById('text').value = '';
	},
	
	esc: function(msg) {
		return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	},
	
	payload: function(method, data) {
		var payload = {
			key: Client.Chat.MSG_KEY,
			method: method,
			data: data
		};
		
		this.socket.send(payload);
	},
	
}
