function HoboMan(canvas, fpsText) {
    this.canvas = canvas;
    this.fpsText = fpsText;
    this.InitCanvas();
    this.world = new World();
    this.level = new Level(this.world);

    this.level.render(this.ctx);
    this.hobo = new Hobo(Hobo.START.x, Hobo.START.y, this.world);
    this.dog = new Dog(160, 160, this.world, this.hobo);
    this.coins = new Coins(this.world);
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
    this.coins.pickup(this.hobo);
    this.render();

    setTimeout(_.bind(this.loop, this), 0);
};

HoboMan.prototype.update = function(dt) {
    this.hobo.update(dt, this.keys);
    this.coins.update(dt);
    this.dog.update(dt);
};

HoboMan.prototype.render = function() {
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.ctxWidth, this.ctxHeight);
    this.level.render(this.ctx, this.canvas.width, this.canvas.height);
    this.coins.render(this.ctx);
    this.hobo.render(this.ctx);
    this.dog.render(this.ctx);
    this.fpsText.innerHTML = (1000/this.frameInterval).toFixed(2) + " fps";
    this.ctx.fillStyle = "black";
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

hoboman = new HoboMan(document.getElementsByTagName('canvas')[0], document.getElementsByTagName('span')[0]);
