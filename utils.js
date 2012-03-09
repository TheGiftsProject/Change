Math.roll = function(chance) {
	return Math.random() < chance;
}

Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
}

Array.prototype.shuffle = function() {
	for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
	return this;
};