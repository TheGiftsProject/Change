function Hobo(x, y, world) {
    this.x = x;
    this.y = y;
    this.direction = '';
    this.nextDirection = '';
    this.images = new HoboAnimation();
    this.points = 0;
    this.world = world;
    this.lives = 3;
    this.coinSound = 0;
    this.powerup = -1;
    this.flickerOn = false;
    this.godmode = false;
    this.hulkmode = false;
    this.powerupLength = 0;
    this.lastLength = 0;
    this.accumulator = 0;

    var startCell = this.world.getCellAt(this.currentRow(), this.currentCol());
    startCell.setAsPath();
    startCell.removeContent();
    this.sounds = {
        die: new EmptySound("bitten.wav"),
        coin0: new EmptySound("coin0.wav"),
        coin1: new EmptySound('coin1.wav'),
        bonus: new EmptySound('bonus.wav'),
        powerup: new EmptySound('godmode.wav'),
        down: new EmptySound('down.wav'),
        life: new EmptySound('life.wav'),
        warning: new EmptySound('warning.wav')
    };
    var that = this;
    soundManager.onready(function() {
        var newsounds = {};
        for (var key in that.sounds){
            newsounds[key] = that.sounds[key].load();
        }
        that.sounds = newsounds;
    })
}

Hobo.SIZE = {
    w: 16,
    h: 16
};

Hobo.START = {
    x: 16,
    y: 16
};

Hobo.POWERUP_LENGTH = 10;
Hobo.POWERUP_FLICKER_START = 4;
Hobo.SPEED = 82;
Hobo.SPEED_BACKUP = Hobo.SPEED;
Hobo.SPEED_BONUS = 120;

Hobo.prototype.update = function(dt, keys) {
    this.updateFromKeys(dt, keys);
    this.updatePowerups(dt);
    this.move(dt);
    this.images.update(dt);
};

Hobo.prototype.updatePowerups = function(dt) {
    var enableSpeedPowerup = false;
    var enableGodmode = false;
    var enableHulk = false;
    if (this.powerup > -1) {
        if (this.powerupLength > 0) {
            if (this.powerupLength <= Hobo.POWERUP_FLICKER_START) {
                this.lastLength += dt;
                var log = Math.max(Math.log(this.powerupLength) / 3, 0.1);
                if (this.lastLength >= log) {
                    this.lastLength = 0;
                    this.flickerOn = !this.flickerOn;
                    this.sounds.warning.play();
                }
            }
            this.powerupLength -= dt;
            switch (this.powerup) {
                case Content.POWERUPS.SPEED:   enableSpeedPowerup = true; break;
                case Content.POWERUPS.GODMODE: enableGodmode = true; break;
                case Content.POWERUPS.BREAKER: enableHulk = true; break;
            }
        }
        else {
            this.sounds.down.play();
            this.powerup = -1;
            this.flickerOn = false;
            this.lastLength = 0;
        }
    }
    if (enableSpeedPowerup) {
        Hobo.SPEED = Hobo.SPEED_BONUS;
    }
    else {
        Hobo.SPEED = Hobo.SPEED_BACKUP;
    }
    this.godmode = enableGodmode;
    this.hulkmode = enableHulk;
}

Hobo.prototype.updateFromKeys = function(dt, keys) {
    if (keys.left && this.direction != "left") {
        this.nextDirection = 'left';
    }
    if (keys.up && this.direction != "up") {
        this.nextDirection = 'up';
    }
    if (keys.right && this.direction != "right") {
        this.nextDirection = 'right';
    }
    if (keys.down && this.direction != "down") {
        this.nextDirection = 'down';
    }
};

Hobo.prototype.move = function(dt) {

    var oldCol = Math.floor(this.x / Hobo.SIZE.w);
    var oldRow = Math.floor(this.y / Hobo.SIZE.h);
    var cell = this.world.getCellAt(oldRow,oldCol);

    if (cell.hasContent()) {
        if (this.direction == "up" || this.direction == "left"){
            if (this.x % Hobo.SIZE.w <= 2 && this.y % Hobo.SIZE.h <= 2){
                this.collectContent(cell);
            }
        } else{
            this.collectContent(cell);
        }
    }

    if (this.direction == "") {
        this.direction = this.nextDirection;
    }

    this.moveCoordinates(dt);
    this.turnIfCan(oldRow, oldCol);
    this.stopAtWall(oldRow, oldCol);
};

Hobo.prototype.render = function(ctx) {
    this.images.drawFrame(ctx, this);
};

Hobo.prototype.addPoints = function(points) {
    this.points += points;
};

Hobo.prototype.currentCol = function(){
    return Math.floor(this.x / Hobo.SIZE.w);
};

Hobo.prototype.currentRow = function(){
    return Math.floor(this.y / Hobo.SIZE.h);
};

Hobo.prototype.collectContent = function(cell) {
    this.addPoints(cell.content.getValue());
    if (cell.content.isBonus()) {
        this.sounds.bonus.play();
    }
    else if (cell.content.isPowerup()) {
        this.powerup = cell.content.value;
        this.powerupLength = Hobo.POWERUP_LENGTH;
        this.sounds.powerup.play();
    } else if (cell.content.isLife()){
        this.lives = Math.min(this.lives + 1, 5);
        window.hoboman.updateLives(this.lives);
        this.sounds.life.play()
    } else {
        this.sounds["coin" + this.coinSound].play();
    }
    cell.removeContent();
    this.coinSound = 1 - this.coinSound;
}

Hobo.prototype.bitten = function(dog){
    dog.kill();
    this.powerup = -1;
    this.powerupLength = 0;
    this.direction = '';
    this.nextDirection = '';
    if (this.godmode) {
        this.addPoints(dog.getValue());
    }
    else {
        this.lives -= 1;
        window.hoboman.updateLives(this.lives);
        this.x = Hobo.START.x;
        this.y = Hobo.START.y;
        this.sounds.die.play();

        if (this.lives <= 0) {
            window.hoboman.gameOver(this.points);
        }
    }
};

Hobo.prototype.isWall = function(direction, row, col){
    if (!row) row = this.currentRow();
    if (!col) col = this.currentCol();
    switch (direction) {
            case "left": col -= 1; break;
            case "up": row -=1 ;break;
            case "right": col += 1;break;
            case "down": row += 1;break;
        }
    return this.world.getCellAt(row,col).isWall();
};

Hobo.prototype.moveCoordinates = function(dt){
    var motion = Hobo.SPEED * dt;
    switch (this.direction) {
        case 'left':
            this.x -= motion;
            break;
        case 'up':
            this.y -= motion;
            break;
        case 'right':
            this.x += motion;
            break;
        case 'down':
            this.y += motion;
            break;
    }
};

Hobo.prototype.stopAtWall = function(oldRow, oldCol){
    var row = this.currentRow();
    var col = this.currentCol();

    if (this.direction == "right"){
        oldCol = col;
        col += 1;
    }
    if (this.direction == "down"){
        oldRow = row;
        row += 1;
    }

    if (this.world.getCellAt(row, col).isWall()){
        this.x = oldCol * 16;
        this.y = oldRow * 16;
        if (this.nextDirection && !this.isWall(this.nextDirection)){
            //TURN at Wall
            this.turn();
        }
    }
};

Hobo.prototype.turn = function(){
    this.direction = this.nextDirection;
    this.nextDirection = null;
};

Hobo.prototype.opposite = function(direction){
    switch (direction) {
        case 'left': return "right";
        case 'up': return "down";
        case 'right': return "left";
        case 'down': return "up";
    }
};

Hobo.prototype.turnIfCan = function(oldRow, oldCol){
    if (this.nextDirection == null) return;
    if (this.nextDirection == this.opposite(this.direction)){
        this.turn();
        return;
    }

    var row = oldRow;
    var col = oldCol;
    if (this.direction == "right" || this.direction == "down"){
        row = this.currentRow();
        col = this.currentCol();
    }

    var horizontal = (this.direction == "left" || this.direction == "right");

    if ((horizontal && oldCol != this.currentCol()) || (!horizontal && oldRow != this.currentRow())){
        if (!this.isWall(this.nextDirection, row, col)){
            this.turn();
            this.x = col * Hobo.SIZE.w;
            this.y = row * Hobo.SIZE.h;
            if (horizontal){
                if (this.nextDirection == "up") this.y -= Hobo.SIZE.h;
                if (this.nextDirection == "down") this.y += Hobo.SIZE.h;
            } else {
                if (this.nextDirection == "left") this.x -= Hobo.SIZE.w;
                if (this.nextDirection == "right") this.x += Hobo.SIZE.w;
            }
        }
    }
};