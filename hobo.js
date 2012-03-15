function Hobo(x, y, world) {
    this.x = x;
    this.y = y;
    this.direction = '';
    this.nextDirection = '';
    this.images = new HoboAnimation();
    this.points = 0;
    this.world = world;
    this.world.getCellAt(this.currentRow(), this.currentCol()).setAsPath();
    this.world.collectAt(this.currentRow(), this.currentCol());
    SoundJS.add("die", "resources/sound/bitten.wav");
    SoundJS.add("coin0", "resources/sound/coin0.wav",5);
    SoundJS.add("coin1", "resources/sound/coin1.wav",5);
    SoundJS.add("coin2", "resources/sound/coin2.wav",5);
    SoundJS.add("coin3", "resources/sound/coin3.wav",5);
}

Hobo.SIZE = {
    w: 16,
    h: 16
};

Hobo.START = {
    x: 16,
    y: 16
};

Hobo.SPEED = 82;

Hobo.prototype.update = function(dt, keys) {
    this.updateFromKeys(dt, keys);
    this.move(dt);
    this.images.update(dt);
};

Hobo.prototype.updateFromKeys = function(dt, keys) {
    if (keys.left) {
        this.nextDirection = 'left';
    }
    if (keys.up) {
        this.nextDirection = 'up';
    }
    if (keys.right) {
        this.nextDirection = 'right';
    }
    if (keys.down) {
        this.nextDirection = 'down';
    }
};

Hobo.prototype.move = function(dt) {

    var oldCol = Math.floor(this.x / Hobo.SIZE.w);
    var oldRow = Math.floor(this.y / Hobo.SIZE.h);
    var cell = this.world.getCellAt(oldRow,oldCol);

    if (cell.hasContent()) {
        this.collectCoin(cell.content, oldRow, oldCol);
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


Hobo.prototype.collectCoin = function(content_type, row, col) {
    this.addPoints(this.translatePoints(content_type));
    this.world.collectAt(row, col);
    SoundJS.play("coin" + Math.floor(Math.random() * 4));
}

Hobo.prototype.bitten = function(){
    this.points = 0;
    this.x = Hobo.START.x;
    this.y = Hobo.START.y;
    SoundJS.play("die");
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

Hobo.prototype.translatePoints = function(content_type) {
    switch(content_type) {
        case 0: return 10;
        case 1: return 5;
        case 2: return 1;
    }
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

Hobo.prototype.turnIfCan = function(oldRow, oldCol){
    if (this.nextDirection == null) return;

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