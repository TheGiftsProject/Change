function Dog(x, y, world, hobo) {
    this.x = x;
    this.y = y;
    this.direction = '';
    this.nextDirection = '';
    this.renderer = new DogRenderer();
    this.world = world;
    this.world.getCellAt(Math.floor(this.x / Dog.SIZE.w)-20 ,Math.floor(this.y / Dog.SIZE.h)-20).setAsPath();
    this.hobo = hobo;
}

Dog.SIZE = {
    w: 16,
    h: 16
};

Dog.SPEED = 82;

Dog.prototype.update = function(dt) {
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

    this.move(dt);
    this.renderer.update(dt);
    this.checkCollistion();
};

Dog.prototype.move = function(dt) {
    var distFromCellX = Math.floor(this.x) % Dog.SIZE.w;
    var distFromCellY = Math.floor(this.y) % Dog.SIZE.h;
    var currentCol = Math.floor(this.x / Dog.SIZE.w);
    var currentRow = Math.floor(this.y / Dog.SIZE.h);
    var oldX = this.x;
    var oldY = this.y;

    if (distFromCellX < 5 && distFromCellY < 5) {
        this.direction = this.nextDirection;
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
    }

    var motion = Dog.SPEED * dt;

    switch (this.direction) {
        case 'left':
            this.x -= motion;
            break;
        case 'up':
            this.y -= motion;
            break;
        case 'right':
            if (this.world.getCellAt(currentRow-20,currentCol-19).isWall()){
                break;
            }
            this.x += motion;
            break;
        case 'down':
            if (this.world.getCellAt(currentRow-19,currentCol-20).isWall()){
                break;
            }
            this.y += motion;
            break;
    }

    var newCol = Math.floor(this.x / Dog.SIZE.w);
    var newRow = Math.floor(this.y / Dog.SIZE.h);
    if (this.world.getCellAt(newRow-20,newCol-20).isWall()){
        this.x = currentCol * Dog.SIZE.w;
        this.y = currentRow * Dog.SIZE.h;
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
