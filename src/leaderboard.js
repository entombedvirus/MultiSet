var util  = require('utilities');

Leaderboard = function() {
	this.count = 0;
	this.playerPool = {};
}

Leaderboard.MSG_KEY = "Leaderboard";

Leaderboard.prototype = {
	addUser: function(user) {
		this.playerPool[user.getId()] = user;
		this.count++;
		
		this.onConnect(user);
		
		var lb = this;
		user.client.on('disconnect', function() {
			lb.onDisconnect.call(lb, user);
		});
	},
	
	removeUser: function(user) {
		delete this.playerPool[user.getId()];
		this.count--;
	},
	
	onConnect: function(user) {
		user.payload(Leaderboard.MSG_KEY, "refreshLeaderboard", this.toTO());
		user.broadcast(Leaderboard.MSG_KEY, "refreshLeaderboard", this.toTO());
	},
	
	onDisconnect: function(user) {
		this.broadcast(user);
	},
	
	broadcast: function(user) {
		user.broadcast(Leaderboard.MSG_KEY, "refreshLeaderboard", this.toTO());
		user.payload(Leaderboard.MSG_KEY, "refreshLeaderboard", this.toTO());
	},
	
	toTO: function() {
		var obj = {};
		for (var cid in this.playerPool) obj[cid] = this.playerPool[cid].toTO();
		return obj;
	},
}
