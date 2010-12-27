if (typeof(Client) == "undefined") Client = {};

// Constructor
Client.Logger = function(socket) {
	this.socket = socket;
	this.socket.on('message', bind(this, this.onMessage));
};

Client.Logger.prototype = {
	onMessage: function(obj) {
		if (obj.key)
			this.log("Message Received: ", obj.key, obj.method, obj.data);
		else
			this.error("Message received does not match expected structure", obj);
	},
	
	log: function() {
		console.log.apply(console, arguments);
	},
	
	error: function() {
		console.error.apply(console, arguments);
	}
}