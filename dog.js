function Dog(x, y, world, hobo) {
    this.x = x;
    this.y = y;
    this.direction = '';
    this.nextDirection = '';
    this.renderer = new DogRenderer();
    this.world = world;
    this.world.getCellAt(Math.floor(this.x / Dog.SIZE.w) ,Math.floor(this.y / Dog.SIZE.h)).setAsPath();
    this.hobo = hobo;
    SoundJS.add("bark", "resources/sound/bark.wav",2);
}

Dog.SIZE = {
    w: 16,
    h: 16
};

Dog.SPEED = 82;

Dog.prototype.update = function(dt) {
    this.decideOnDirection2();
    this.move(dt);
    this.renderer.update(dt);
    this.checkCollistion();
    this.bark();
};

Dog.prototype.move = function(dt) {
    var oldCol = Math.floor(this.x / Dog.SIZE.w);
    var oldRow = Math.floor(this.y / Dog.SIZE.h);

    if (this.direction == "") {
        this.direction = this.nextDirection;
    }

    this.moveCoordinates(dt);
    this.turnIfCan(oldRow, oldCol);
    this.stopAtWall(oldRow, oldCol);
};


Dog.prototype.moveCoordinates = function(dt){
    var motion = Dog.SPEED * dt;
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

Dog.prototype.stopAtWall = function(oldRow, oldCol){
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

Dog.prototype.turn = function(){
    this.direction = this.nextDirection;
    this.nextDirection = null;
};

Dog.prototype.turnIfCan = function(oldRow, oldCol){
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
            this.x = col * Dog.SIZE.w;
            this.y = row * Dog.SIZE.h;
            if (horizontal){
                if (this.nextDirection == "up") this.y -= Dog.SIZE.h;
                if (this.nextDirection == "down") this.y += Dog.SIZE.h;
            } else {
                if (this.nextDirection == "left") this.x -= Dog.SIZE.w;
                if (this.nextDirection == "right") this.x += Dog.SIZE.w;
            }
        }
    }
};
Dog.prototype.render = function(ctx) {
    this.renderer.drawFrame(ctx, this);
};

Dog.prototype.checkCollistion = function(){
    if (this.currentCol() == this.hobo.currentCol() && this.currentRow() == this.hobo.currentRow()) {
        this.hobo.bitten();
    }

};

Dog.prototype.currentCol = function(){
    return Math.floor(this.x / Dog.SIZE.w);
};

Dog.prototype.currentRow = function(){
    return Math.floor(this.y / Dog.SIZE.h);
};

Dog.prototype.bark = function(){
//    if (this.currentCol() == this.hobo.currentCol() || this.currentRow() == this.hobo.currentRow()) {
//            SoundJS.play("bark");
//    }
};


Dog.prototype.isWall = function(direction, row, col){
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


Dog.prototype.turnLeft = function(direction){
    switch (direction) {
        case "left": return "up";
        case "up": return "right";
        case "right": return "down";
        case "down": return "left";
    }
};


Dog.prototype.turnRight = function(direction){
    switch (direction) {
        case "left": return "down";
        case "up": return "left";
        case "right": return "up";
        case "down": return "right";
    }
};

Dog.prototype.turnAround = function(direction){
    switch (direction) {
        case "left": return "right";
        case "up": return "down";
        case "right": return "left";
        case "down": return "up";
    }
};


Dog.prototype.decideOnDirection = function(){
    var xDiff = this.x - this.hobo.x;
    var yDiff = this.y - this.hobo.y;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff < 0) {
            this.nextDirection = 'right';

        } else {
            this.nextDirection = 'left';
        }

    } else {
        if (yDiff < 0) {
            this.nextDirection = 'down';
        } else {
            this.nextDirection = 'up';
        }
    }


    var randTurn = Math.random() > 0.5;
    while (this.isWall(this.nextDirection)){
        if (randTurn){
            this.nextDirection = this.turnLeft(this.nextDirection);
        } else {
            this.nextDirection = this.turnRight(this.nextDirection);
        }
    }
    if (this.nextDirection == this.direction){
        this.nextDirection = null;
    }

};

Dog.prototype.decideOnDirection2 = function(){
    var xDiff = this.x - this.hobo.x;
    var yDiff = this.y - this.hobo.y;

    var xDirection = (xDiff < 3) ? 'right' : 'left';
    var yDirection = (yDiff < 3) ? 'down' : 'up';

    if (Math.abs(xDiff) > Math.abs(yDiff)){
        this.nextDirection = xDirection;
        if (this.isWall(xDirection) && (this.direction == xDirection)) this.nextDirection = yDirection;
    } else {
        this.nextDirection = yDirection;
        if (this.isWall(yDirection) && (this.direction == yDirection)) this.nextDirection = xDirection;
    }

    if ((this.direction == xDirection || this.direction == yDirection) && this.isWall(yDirection) && this.isWall(xDirection)){
        if (this.isWall(this.turnAround(yDirection))){
            this.nextDirection = this.turnAround(xDirection)
        } else {
            this.nextDirection = this.turnAround(yDirection)
        }

    }

    if (this.nextDirection == this.direction){
        this.nextDirection = null;
    } else {
        if (Math.random() > 0.8){
            this.nextDirection = null;
        }
    }
};