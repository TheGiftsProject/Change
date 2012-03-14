
Math.rollWithVariance = function(chance, variance_chance) {
    variance_chance = variance_chance || 2;
    var variance = 0;
    var random_mod = 2;
    var variance_chance_factor = parseInt(Math.random() * 100) % variance_chance == 0;
    var random_factor = parseInt(3+(0-3)*Math.random()) % random_mod == 0;

    if( variance_chance_factor  && random_factor === true  ) {
        variance = Math.random();
    }

	return Math.roll(chance + variance);
};

Math.roll = function(chance) {
	return Math.random() < chance;
};

Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};

Array.prototype.shuffle = function() {
	for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
	return this;
};