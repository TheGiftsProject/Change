function Hobo(x, y, world) {
    this.x = x;
    this.y = y;
    this.direction = '';
    this.nextDirection = '';
    this.images = new HoboAnimation();
    this.points = 0;
    this.world = world;
    this.world.getCellAt(Math.floor(this.x / Hobo.SIZE.w) ,Math.floor(this.y / Hobo.SIZE.h)).setAsPath();
    SoundJS.add("die", "resources/sound/bitten.wav");
}

Hobo.SIZE = {
    w: 16,
    h: 16
};

Hobo.SPEED = 82;

Hobo.prototype.update = function(dt, keys) {
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

    this.move(dt);
    this.images.update(dt);
};

Hobo.prototype.move = function(dt) {
    var distFromCellX = Math.floor(this.x) % Hobo.SIZE.w;
    var distFromCellY = Math.floor(this.y) % Hobo.SIZE.h;
    var currentCol = Math.floor(this.x / Hobo.SIZE.w);
    var currentRow = Math.floor(this.y / Hobo.SIZE.h);
    var oldX = this.x;
    var oldY = this.y;

    if (distFromCellX < 5 && distFromCellY < 5) {
        this.direction = this.nextDirection;
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
    }

    var motion = Hobo.SPEED * dt;

    switch (this.direction) {
        case 'left':
            this.x -= motion;
            break;
        case 'up':
            this.y -= motion;
            break;
        case 'right':
            if (this.world.getCellAt(currentRow,currentCol+1).isWall()){
                break;
            }
            this.x += motion;
            break;
        case 'down':
            if (this.world.getCellAt(currentRow+1,currentCol).isWall()){
                break;
            }
            this.y += motion;
            break;
    }

    var newCol = Math.floor(this.x / Hobo.SIZE.w);
    var newRow = Math.floor(this.y / Hobo.SIZE.h);
    if (this.world.getCellAt(newRow,newCol).isWall()){
        this.x = currentCol * Hobo.SIZE.w;
        this.y = currentRow * Hobo.SIZE.h;
    }
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


Hobo.prototype.bitten = function(){
    this.points = 0;
    this.x = 0;
    this.y = 0;
    SoundJS.play("die");
};
