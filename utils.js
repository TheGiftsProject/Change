
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

Math.randomRange = function(A,B) {
    return B + (A-B) * Math.random();
};