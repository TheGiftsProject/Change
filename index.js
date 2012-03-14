function HoboMan(canvas) {
    this.canvas = canvas;
    this.InitCanvas();
    this.world = new World();
    this.level = new Level(this.world);
    this.entities = [];

    this.hobo = new Hobo(Hobo.START.x, Hobo.START.y, this.world);
    this.dog = new Dog(160, 160, this.world, this.hobo);
    this.dog2 = new Dog(16, 320, this.world, this.hobo);
    this.dog3 = new Dog(320, 16, this.world, this.hobo);
    this.entities.push(this.dog);
    this.entities.push(this.dog2);
    this.entities.push(this.dog3);
    this.entities.push(this.hobo);

    this.keys = {
        left: 0,
        right: 0,
        up: 0,
        down: 0
    };

    document.body.addEventListener('keydown', _.bind(this.updateKeys, this));
    document.body.addEventListener('keyup', _.bind(this.updateKeys, this));

    this.targetInterval = 33;
    this.currentTime = new Date().getTime();
    this.frameTimeAccumulator = 0;
    this.loop();
}

HoboMan.prototype.loop = function() {
    var newTime = new Date().getTime();
    this.frameInterval = newTime - this.currentTime;
    this.currentTime = newTime;
    this.frameTimeAccumulator += this.frameInterval;

    while (this.frameTimeAccumulator >= this.targetInterval) {
        this.update(this.targetInterval / 1000);
        this.frameTimeAccumulator -= this.targetInterval;
    }
    this.render();

    setTimeout(_.bind(this.loop, this), 0);
};

HoboMan.prototype.update = function(dt) {
    for (var i=0; i < this.entities.length ; i++){
        this.entities[i].update(dt, this.keys);
    }
};

HoboMan.prototype.render = function() {
    // clear last frame
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.ctxWidth, this.ctxHeight);

    // render game
    this.ctx.save();
    var viewport = {
        x: this.hobo.x - this.ctxWidth/2,
        y: this.hobo.y - this.ctxHeight/2,
        width: this.ctxWidth,
        height: this.ctxHeight
    };
    this.ctx.translate(Math.floor(-viewport.x), Math.floor(-viewport.y));
    this.level.render(this.ctx, viewport);
    for (var i=0; i < this.entities.length ; i++){
        this.entities[i].render(this.ctx);
    }
    this.ctx.restore();

    // render UI
    this.ctx.fillStyle = "black";
    this.ctx.fillText("fps: " + (1000/this.frameInterval).toFixed(2), 10, 12);
    this.ctx.fillText("Score: " + this.hobo.points,300,12);
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
