function Hobo(x, y) {
    this.x = x;
    this.y = y;
    this.direction = '';
    this.images = new HoboAnimation();
}

Hobo.SIZE = {
    w: 16,
    h: 16
};

Hobo.SPEED = 0.5;

Hobo.prototype.update = function(keys) {
    if (keys.left) {
        this.direction = 'left';
    }
    if (keys.up) {
        this.direction = 'up';
    }
    if (keys.right) {
        this.direction = 'right';
    }
    if (keys.down) {
        this.direction = 'down';
    }

    this.move();
};

Hobo.prototype.move = function() {
    switch (this.direction) {
        case 'left':
            this.x -= Hobo.SPEED;
            break;
        case 'up':
            this.y -= Hobo.SPEED;
            break;
        case 'right':
            this.x += Hobo.SPEED;
            break;
        case 'down':
            this.y += Hobo.SPEED;
            break;
    }
}

Hobo.prototype.render = function(ctx) {
    this.images.drawFrame(ctx, this.x, this.y);
    // ctx.fillStyle = "#808080";
    // ctx.fillRect(this.x, this.y, Hobo.SIZE.w, Hobo.SIZE.h);
};
