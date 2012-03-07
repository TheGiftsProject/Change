function Hobo(x, y) {
    this.x = x;
    this.y = y;
    this.direction = '';
    this.nextDirection = '';
    this.images = new HoboAnimation();
    this.points = 0;
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

    if (distFromCellX == 0 && distFromCellY == 0) {
        this.direction = this.nextDirection;
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
            this.x += motion;
            break;
        case 'down':
            this.y += motion;
            break;
    }

    var newCol = Math.floor(this.x / Hobo.SIZE.w);
    var newRow = Math.floor(this.y / Hobo.SIZE.h);
}

Hobo.prototype.render = function(ctx) {
    this.images.drawFrame(ctx, this);
};
Hobo.prototype.addPoints = function(points) {
    this.points += points;
};

