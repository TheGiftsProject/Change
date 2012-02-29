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

Hobo.SPEED = 32;

Hobo.prototype.update = function(dt, keys) {
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

    this.move(dt);
    this.images.update(dt);
};

Hobo.prototype.move = function(dt) {
    switch (this.direction) {
        case 'left':
            this.x -= Hobo.SPEED * dt;
            break;
        case 'up':
            this.y -= Hobo.SPEED * dt;
            break;
        case 'right':
            this.x += Hobo.SPEED * dt;
            break;
        case 'down':
            this.y += Hobo.SPEED * dt;
            break;
    }
}

Hobo.prototype.render = function(ctx) {
    this.images.drawFrame(ctx, this);
    // ctx.fillStyle = "#808080";
    // ctx.fillRect(this.x, this.y, Hobo.SIZE.w, Hobo.SIZE.h);
};
