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
    var distFromCellX = Math.floor(this.x) % Hobo.SIZE.w;
    var distFromCellY = Math.floor(this.y) % Hobo.SIZE.h;
    var oldX = this.x;
    var oldY = this.y;
    var oldCol = Math.floor(this.x / Hobo.SIZE.w);
    var oldRow = Math.floor(this.y / Hobo.SIZE.h);

    var cell = this.world.getCellAt(oldRow,oldCol);


    if (cell.hasContent()) {
        this.collectCoin(cell.content, oldRow, oldCol);
    }


    if (!this.isWall(this.nextDirection)){
        if (distFromCellX < 3 && distFromCellY < 3 ) {
            this.direction = this.nextDirection;
        }
    }

    this.moveCoordinates(dt);

    if (this.currentCol() != oldCol || this.currentRow() != oldCol) {
        if (this.world.getCellAt(this.currentRow(), this.currentCol()).isWall()){
//            if (this.direction == "right" || this.direction == "down"){
//                this.x = oldX;
//                this.y = oldY;
//            } else {
                this.x = oldCol * 16;
                this.y = oldRow * 16;
//            }
        }
    }


//    var newCol = Math.floor(this.x / Hobo.SIZE.w);
//    var newRow = Math.floor(this.y / Hobo.SIZE.h);
//    if (this.world.getCellAt(newRow,newCol).isWall()){
//        this.x = currentCol * Hobo.SIZE.w;
//        this.y = currentRow * Hobo.SIZE.h;
//    }
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

Hobo.prototype.currentRowY = function (){
    return this.currentRow() * Hobo.SIZE.h;
};

Hobo.prototype.currentColX = function (){
    return this.currentCol() * Hobo.SIZE.w;
}

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

Hobo.prototype.isWall = function(direction){
    var row = this.currentRow();
    var col = this.currentCol();
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
