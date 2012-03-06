function HoboMan(canvas) {
    this.canvas = canvas;
    this.InitCanvas();
    var world = new World(20, 1);
    this.level = new Level(world);

    this.level.render(this.ctx);
    this.hobo = new Hobo(20, 20);
    this.keys = {
        left: 0,
        right: 0,
        up: 0,
        down: 0
    };

    document.body.addEventListener('keydown', _.bind(this.updateKeys, this));
    document.body.addEventListener('keyup', _.bind(this.updateKeys, this));

    this.loop();
}

HoboMan.prototype.loop = function() {
    this.update(0.016);
    this.render();

    setTimeout(_.bind(this.loop, this), 16);
};

HoboMan.prototype.update = function(dt) {
    this.hobo.update(dt, this.keys);
};

HoboMan.prototype.render = function() {
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.ctxWidth, this.ctxHeight);
    this.level.render(this.ctx, this.canvas.width, this.canvas.height);
    this.hobo.render(this.ctx);
};

HoboMan.prototype.updateKeys = function(ev) {
    var keyName = '';
    switch (ev.keyCode) {
        case 37:
            keyName = 'left';
            break;
        case 38:
            keyName = 'up';
            break;
        case 39:
            keyName = 'right';
            break;
        case 40:
            keyName = 'down';
            break;
    }

    if (keyName !== '') {
        this.keys[keyName] = (ev.type == "keydown" ? 1 : 0);
    }
};

HoboMan.prototype.InitCanvas = function() {
    this.ctx = this.canvas.getContext("2d");
    this.ctxWidth = this.canvas.width;
    this.ctxHeight = this.canvas.height;
};

hoboman = new HoboMan(document.getElementsByTagName('canvas')[0]);
