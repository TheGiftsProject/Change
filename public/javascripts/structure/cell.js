function Cell(isWall) {
    this.wall = isWall;
    if (!isWall) {
        var roll = Math.random();
        if (roll <= Cell.BONUS_CHANCE) {
            this.content = new Content(Content.COIN, Content.COINS.BONUS);
        }
        else if (roll <= Cell.POWERUP_CHANCE) {
            this.content = new Content(Content.POWERUP, Math.roll(0.5) ? Content.POWERUPS.GODMODE: Content.POWERUPS.SPEED);
        }
        else if (roll <= Cell.TOP_COIN_CHANCE) {
            this.content = new Content(Content.COIN, Content.COINS.TOP);
        }
        else if (roll <= Cell.MID_COIN_CHANCE) {
            this.content = new Content(Content.COIN, Content.COINS.MID);
        }
        else if (roll <= Cell.LOW_COIN_CHANCE) {
            this.content = new Content(Content.COIN, Content.COINS.LOW);
        }
        else {
            this.content = null;
        }
    }
    else {
        this.content = null;
    }
};

Cell.LOW_COIN_CHANCE = 0.6;
Cell.MID_COIN_CHANCE = 0.3;
Cell.TOP_COIN_CHANCE = 0.1;
Cell.POWERUP_CHANCE  = 0.01;
Cell.BONUS_CHANCE    = 0.0025;

Cell.prototype.setAsPath = function() {
    this.wall = false;
};

Cell.prototype.isWall = function() {
    return this.wall;
};

Cell.prototype.isPath = function() {
    return ! this.wall;
};

Cell.prototype.hasContent = function() {
    return this.content !== null;
};

Cell.prototype.removeContent = function() {
    return this.content = null;
};
