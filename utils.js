
Math.rollWithVariance = function(chance, variance_chance) {
    variance_chance = variance_chance || 2;
    var variance = 0;
    var random_mod = 2;
    var variance_chance_factor = parseInt(Math.random() * 100) % variance_chance == 0;
    var random_factor = parseInt( Math.randomRange(0,3) )% random_mod == 0;

    if( variance_chance_factor  && random_factor === true  ) {
        variance = Math.random();
    }

	return Math.roll(chance + variance);
};

Math.roll = function(chance) {
	return Math.random() < chance;
};

/**
 * builds a 4 number sequence, e.g [1.0, 0.8, 0.2, 0.1]
 */
Math.sequenceBuilder = function sequenceBuilder(total, maxLim, jumpLim) {

    // total value of the sequance
    var totalValue = total || 4.5;

    // we set this to higher value then 1 so that the 1st run will have a better chance of being connected
    var maxLimit = maxLim || 1.3;

    // the max amount to reduce from the upper bound each run
    var jumpLimit = jumpLim || 0.1;

    var result = 0;

    return function() {
        if (totalValue > 0) {
            result = Math.max(0, Math.randomRange(0, maxLimit));
            maxLimit = Math.max(0, maxLimit - Math.randomRange(0, jumpLimit));
            totalValue = totalValue - result; // save for next time
        }
        return result;
    }
};


Math.randomRange = function(A,B) {
    return B + (A-B) * Math.random();
};

Array.prototype.shuffle = function() {
    for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
    return this;
};