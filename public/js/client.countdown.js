if (typeof(Client) == "undefined") Client = {};

// Constructor
Client.Countdown = function(user) {
	this.user = user;
	this.endsAt = null;
	this.duration = 0;
	var canvas = this.canvas = $('#countdown').get(0);
	canvas.width = canvas.height = 100;
};

Client.Countdown.prototype = {
	start: function(secsLeft) {
		this.duration = (secsLeft * 1000);
		this.endsAt = Date.now() + this.duration;
		
		this.interval && clearInterval(this.interval);
		this.interval = setInterval(bind(this, this.tick), 1000/30);
	},
	
	tick: function() {
		if (this.endsAt < Date.now()) clearInterval(this.interval);
		this.draw();
	},
	
	draw: function() {
		this.clearCanvas();
		var canvas = this.canvas;
		
		var ctx = canvas.getContext("2d");
		
		var x = canvas.width / 2, y = canvas.height / 2;
		var ratio = (this.endsAt - Date.now()) / this.duration;
		
		// The Pie
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.fillStyle = ctx.strokeStyle = "rgb(0,0,150)";
		var startAngle = 1.5*Math.PI;
		ctx.arc(x, y, 48, startAngle, startAngle + ((1 - ratio) * 2*Math.PI), true);
		ctx.fill();
		
		// The full circle
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.fillStyle = "rgb(150,0,0)";
		ctx.arc(x, y, 43, 0, 2*Math.PI, false);
		ctx.fill();
		
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.font = "24px Verdana";
		ctx.fillText(this.formatedTimeLeft(), x - 30, y + 10);
	},
	
	formatedTimeLeft: function() {
		var secsLeft = parseInt((this.endsAt - Date.now()) / 1000);
		
		var mins = parseInt(secsLeft / 60);
		var secs = secsLeft % 60;
		
		return sprintf("%02d:%02d", mins, secs);
	},
	
	clearCanvas: function() {
		var canvas = this.canvas, ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
	}
}
