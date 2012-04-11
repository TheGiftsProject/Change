function Dog(x, y, world, hobo) {
    this.x = x;
    this.y = y;
    this.direction = '';
    this.nextDirection = '';
    this.type = Math.floor(Math.randomRange(0,3));
    this.renderer = new DogRenderer(this.type);
    this.world = world;
    this.hobo = hobo;
    this.speed = Dog.SPEED;
    if (this.type == Dog.TYPE.black) this.speed += 8;
    this.barked = false;
    this.sounds = {
        bark : new EmptySound('bark.wav'),
        die  : new EmptySound('dead_dog.wav')
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

Dog.SIZE = {
    w: 16,
    h: 16
};

Dog.TYPE = {
    brown: 0,
    white: 1,
    black: 2
};

Dog.SPEED = 80;
Dog.VALUE = 50;

Dog.prototype.update = function(dt) {
    this.decideOnDirection();
    this.move(dt);
    this.renderer.update(dt);
    this.checkCollision();
    this.checkBark();
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
    var motion = this.speed * dt;
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

Dog.COLLISION_RADIUS = 5;

Dog.prototype.checkCollision = function(){
    if (Math.abs(this.x - this.hobo.x) <= Dog.COLLISION_RADIUS && Math.abs(this.y - this.hobo.y) <= Dog.COLLISION_RADIUS) {
        this.hobo.bitten(this);
    }

};

Dog.prototype.kill = function() {
    this.sounds.die.play();
    this.world.removeEntity(this);
}

Dog.prototype.currentCol = function(){
    return Math.floor(this.x / Dog.SIZE.w);
};

Dog.prototype.currentRow = function(){
    return Math.floor(this.y / Dog.SIZE.h);
};

Dog.prototype.checkBark = function(){
    if (!this.barked && this.closeToHobo() && !this.isRunningAway()) {
        this.barked = true;
        this.sounds.bark.play();
    }
};

Dog.BARK_DISTANCE = 1;

Dog.prototype.closeToHobo = function() {
    if (this.currentCol() == this.hobo.currentCol() && Math.abs(this.currentRow() - this.hobo.currentRow()) <= Dog.BARK_DISTANCE) {
        return true;
    }
    else if (this.currentRow() == this.hobo.currentRow() && Math.abs(this.currentCol() - this.hobo.currentCol()) <= Dog.BARK_DISTANCE) {
        return true;
    }
    return false;
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

Dog.prototype.getValue = function() {
    return Dog.VALUE;
};

Dog.prototype.decideOnDirection = function() {
    switch(this.type){
        case Dog.TYPE.brown : this.brownDogDecideOnTurn(); break;
        case Dog.TYPE.white : this.whiteDogDecideOnTurn(); break;
        case Dog.TYPE.black : this.blackDogDecideOnTurn(); break;
    }
};

Dog.prototype.whiteDogDecideOnTurn = function(){
    var target = {
        x: this.hobo.x,
        y: this.hobo.y
    };
    switch(this.hobo.direction){
        case 'up': target.y -= 5; break;
        case 'down': target.y += 5; break;
        case 'left': target.x -= 5; break;
        case 'right': target.x += 5; break;
    }

    this.decideToTarget(target, 0.5);
};

Dog.prototype.blackDogDecideOnTurn = function(){
    var target = {
        x: this.hobo.x,
        y: this.hobo.y
    };

    if (this.direction == "") this.direction = "left";

    if (this.isWall(this.direction)){
        var isLeftWall = this.isWall(this.turnLeft(this.direction)),
            isRightWall= this.isWall(this.turnRight(this.direction));
        if (isLeftWall && isRightWall) {
            this.nextDirection = this.turnAround(this.direction);
        }
        else if (isLeftWall) {
            this.nextDirection = this.turnRight(this.direction);
        }
        else if (isRightWall) {
            this.nextDirection = this.turnLeft(this.direction);
        } else {
            var rightDistance = this.distance(this.futureLocation(this, this.turnRight(this.direction)), target);
            var leftDistance = this.distance(this.futureLocation(this, this.turnLeft(this.direction)), target);
            if (rightDistance < leftDistance && Math.random() < 0.8){
                this.nextDirection = this.turnRight(this.direction);
            } else {
                this.nextDirection = this.turnLeft(this.direction);
            }
        }
    }

    if (this.isRunningAway()) {
        this.nextDirection = this.turnAround(this.nextDirection);
    }
};

Dog.prototype.distance = function(src, target){
    var deltaX = src.x - target.x,
            deltaY = src.y - target.y;
    return Math.sqrt(deltaX*deltaX + deltaY * deltaY);
};

Dog.prototype.futureLocation = function(src, direction){
    var location  = {
        x: src.x,
        y: src.y
    };
    switch (direction){
        case "up" : location.y -= 5; break;
        case "down" : location.y += 5; break;
        case "left" : location.x -= 5; break;
        case "right" : location.x += 5; break;
    }
    return location;
};

Dog.prototype.brownDogDecideOnTurn = function(){
    this.decideToTarget(this.hobo, 0.8);
};

Dog.prototype.isRunningAway = function(){
    return this.hobo.godmode;
};

Dog.prototype.decideToTarget = function(target, chanceToMiss){
    var xDiff = this.x - target.x;
    var yDiff = this.y - target.y;

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

    if (this.nextDirection == this.turnAround(this.direction) && !this.isWall(this.direction)){
        this.nextDirection = null;
    }

    if (this.isRunningAway()) {
        this.nextDirection = this.turnAround(this.nextDirection);
    }

    if (this.nextDirection == this.direction){
        this.nextDirection = null;
    } else if (this.direction == "") {
        this.direction = "right";
    } else {
        if (Math.random() > chanceToMiss){
            this.nextDirection = null;
        }
    }
};
