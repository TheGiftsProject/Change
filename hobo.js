function Hobo(x, y) {
    this.x = x;
    this.y = y;
}

Hobo.SIZE = {
    w: 16,
    h: 16
};

Hobo.SPEED = 0.5;

Hobo.prototype.update = function(keys) {
    if (keys.left) {
        this.x -= Hobo.SPEED;
    }
    if (keys.up) {
        this.y -= Hobo.SPEED;
    }
    if (keys.right) {
        this.x += Hobo.SPEED;
    }
    if (keys.down) {
        this.y += Hobo.SPEED;
    }
};

Hobo.prototype.render = function(ctx) {
    ctx.fillStyle = "#808080";
    ctx.fillRect(this.x, this.y, Hobo.SIZE.w, Hobo.SIZE.h);
};
