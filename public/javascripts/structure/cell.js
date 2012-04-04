function Cell(isWall) {
    this.wall = isWall;
    this.broken = false;
    if (!isWall) {
        var roll = Math.random();
        if (roll <= Cell.BONUS_CHANCE) {
            this.content = new Content(Content.COIN, Content.COINS.BONUS);
        }
        else if (roll <= Cell.LIFE_CHANCE) {
            this.content = new Content(Content.LIVE, Content.LIVES.LIFE);
        }
        else if (roll <= Cell.POWERUP_CHANCE) {
            var powerup_roll = Math.random();
            if (powerup_roll > 0.6) {
                this.content = new Content(Content.POWERUP, Content.POWERUPS.SPEED);
            } else if (powerup_roll > 0.3) {
                this.content = new Content(Content.POWERUP, Content.POWERUPS.GODMODE);
            } else {
                this.content = new Content(Content.POWERUP, Content.POWERUPS.BREAKER);
            }
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

Cell.LOW_COIN_CHANCE = 0.6000;
Cell.MID_COIN_CHANCE = 0.3000;
Cell.TOP_COIN_CHANCE = 0.1000;
Cell.POWERUP_CHANCE  = 0.0150;
Cell.LIFE_CHANCE     = 0.0050;
Cell.BONUS_CHANCE    = 0.0025;

Cell.prototype.setAsPath = function() {
    this.wall = false;
};

Cell.prototype.setBroken = function() {
    this.broken = true;
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
