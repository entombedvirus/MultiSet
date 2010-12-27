if (typeof(Client) == "undefined") Client = {};

// Constructor
Client.User = function() {
	this.socket = new io.Socket(null, {port: 8124, rememberTransport: false});
	this.socket.on('message', bind(this, this.onMessage));
	
	this.logger = new Client.Logger(this.socket);
	
	this.chat  = this.game = null;
	this.score = 0;
};

Client.User.prototype = {
	onMessage: function(obj) {
		switch(obj.method) {
			
			case 'verifyResult':
				this.score = obj.data.score;
				break;
				
		}
	},
	
	initSession: function() {
		var socket = this.socket, user = this;
		
		this.chat = new Client.Chat(user);
		this.game = new Client.SetGame(user);

		socket.connect();
	},

	payload: function(routingKey, method, data) {
		this.logger.log("Message Send:", routingKey, method, data);
		this.socket.send(this.getPayload(routingKey, method, data));
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