if (typeof(Client) == "undefined") Client = {};

// Constructor
Client.Leaderboard = function(user) {
	this.user = user;
	this.container = $('.leaderboard');
	user.socket.on('message', bind(this, this.onMessage));
};

// key used in message passing so that we can filter out messages addressed only to us
Client.Leaderboard.MSG_KEY = "Leaderboard";

Client.Leaderboard.prototype = {
	onMessage: function(obj) {
		// We're only interested in messages with our key
		if (obj.key != Client.Leaderboard.MSG_KEY) return;
		
		if (obj.method) {
			this[obj.method].call(this, obj.data);
		}
	},
	
	refreshLeaderboard: function(data) {
		var new_list = this.toList(data);
		this.container.quicksand(new_list);
	},
	
	toList: function(data) {
		var listItems = {}, unsorted = [];
		
		for (var uid in data) {
			var user = data[uid];
			user.uid = uid;
			
			var li = $('<li></li>').
				attr('data-id', uid).
				append($('<span></span>').text(user.score + ' ' + user.name));
			
			listItems[uid] = li.get(0);
			unsorted.push(user);
		}
		
		var sortedListItems = unsorted.sort(function(a, b) {
			return (a.score < b.score) ? 1 : (a.score > b.score) ? -1 : 0;
			
		}).map(function(user) { return listItems[user.uid] });
		
		return sortedListItems;
	}
}