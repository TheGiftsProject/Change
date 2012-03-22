window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

function HoboMan(canvas) {
    this.canvas = canvas;
    this.InitCanvas();
    this.world = new World(this);
    this.level = new Level(this.world);
    this.entities = [];

    this.hobo = new Hobo(Hobo.START.x, Hobo.START.y, this.world);
    this.dog = new Dog(160, 160, this.world, this.hobo);

    this.entities.push(this.dog);
    this.entities.push(this.hobo);

    this.keys = {
        left: 0,
        right: 0,
        up: 0,
        down: 0
    };

    document.body.addEventListener('keydown', _.bind(this.updateKeys, this));
    document.body.addEventListener('keyup', _.bind(this.updateKeys, this));

    this.targetInterval = 16;
    this.currentTime = new Date().getTime();
    this.frameTimeAccumulator = 0;
    this.frameCounter = 0;
    this.fps = 0;

    this.scoreEl = document.getElementsByClassName("score")[0].getElementsByClassName("realscore")[0];
    this.highScoreEl = document.getElementsByClassName("highscore")[0].getElementsByClassName("realscore")[0];
    this.loop();
    this.updateFPS();
}

HoboMan.prototype.loop = function() {
    var newTime = new Date().getTime();
    var updated = false;
    this.frameInterval = newTime - this.currentTime;
    this.currentTime = newTime;
    this.frameTimeAccumulator += this.frameInterval;

    while (this.frameTimeAccumulator >= this.targetInterval) {
        this.update(this.targetInterval / 1000);
        this.frameTimeAccumulator -= this.targetInterval;
        updated = true;
    }
    if (updated) {
        this.render();
        this.frameCounter += 1;
    }

    window.requestAnimFrame(_.bind(this.loop, this));
};

HoboMan.prototype.update = function(dt) {
    for (var i=0; i < this.entities.length ; i++){
        this.entities[i].update(dt, this.keys);
    }
    this.level.update(dt);
};

HoboMan.prototype.render = function() {
    // clear last frame
    this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);

    // render game
    this.ctx.save();
    var viewport = {
        x: this.hobo.x - (this.ctxWidth/this.ctxScale)/2 + 8,
        y: this.hobo.y - (this.ctxHeight/this.ctxScale)/2 + 8,
        width: this.ctxWidth/this.ctxScale,
        height: this.ctxHeight/this.ctxScale
    };
    this.ctx.scale(this.ctxScale, this.ctxScale);
    this.ctx.translate(Math.floor(-viewport.x), Math.floor(-viewport.y));
    this.level.render(this.ctx, viewport);
    for (var i=0; i < this.entities.length ; i++){
        this.entities[i].render(this.ctx);
    }
    this.ctx.restore();

    // render UI
    this.highScoreEl.innerHTML = "fps: " + this.fps;
    this.scoreEl.innerHTML = this.hobo.points;
};

HoboMan.prototype.updateFPS = function() {
    this.fps = this.frameCounter;
    this.frameCounter = 0;
    setTimeout(_.bind(this.updateFPS, this), 1000);
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
    this.ctxScale = 1;
};

HoboMan.prototype.died = function(points){
    var highscore = parseInt(this.highScoreEl.innerHTML);
    if (points > highscore){
        this.highScoreEl.innerHTML = points;
    }
};

window.hoboman = new HoboMan(document.getElementsByTagName('canvas')[0]);
