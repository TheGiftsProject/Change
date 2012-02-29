function Hobo(x, y) {
    this.x = x;
    this.y = y;
}

Hobo.SIZE = {
    w: 16,
    h: 16
};

Hobo.SPEED = 0.5;

Hobo.prototype.move = function(direction) {
    switch (direction) {
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
};

Hobo.prototype.render = function(ctx) {
    ctx.fillStyle = "#808080";
    ctx.fillRect(this.x, this.y, Hobo.SIZE.w, Hobo.SIZE.h);
};
