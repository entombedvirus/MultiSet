Array.prototype.unique = function() {
	var a = [];
	var l = this.length;
	for(var i=0; i<l; i++) {
		for(var j=i+1; j<l; j++) {
			// If this[i] is found later in the array
			if (this[i] === this[j]) j = ++i;
		}
		a.push(this[i]);
	}
	return a;
};

Array.prototype.shuffle = function() {
	this.sort(function(a, b) { return Math.random() - 0.5 });
	return this;
};


Array.prototype.combinationsOf = function(k) {
	var result = [];
	
	if (k < 1) return result;
	if (k > this.length) return result;
	if (k == this.length) return this.slice(0);
	
	var indices = new Array(k), n = this.length;
	var total = n.factorial() / ((n - k).factorial() * k.factorial());
	
	// initialize the indices array
	indices.length.times(function(i) { indices[i] = i });
	
	// do the easy case first
	result.push(this.valuesAt(indices));
	total--;
	
	var ary = this;
	total.times(function() {
		var i = k - 1;
		while (indices[i] == n - k + i) i--;
		indices[i] += 1;
		for (var j = i + 1; j < k; j++) { indices[j] = indices[i] + j - i }

		result.push(ary.valuesAt(indices));
	});
	
	return result;
}

Array.prototype.valuesAt = function(indices) {
	var ary = this;
	return indices.map(function(idx) { return ary[idx] });
};

Number.prototype.factorial = function() { 
	if (this <= 1) return 1;
	var n = this;
	var sum = n;
	
	while(n > 1) sum *= --n;
	
	return sum;
};

Number.prototype.times = function(cb) { 
	for (var i = 0; i < this; i++) cb(i);
};
