Math.randomIntBetween = function(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

Math.randomIntWithExclusion = function(min, max, exclude) {
	var initial_rand = Math.randomIntBetween(min, max - 1);
    return initial_rand >= exclude ? initial_rand+1 : initial_rand;
}
