var testLevel;
testLevel = "============================\n"
testLevel+= "=            ==            =\n"
testLevel+= "= ========== == ===== ==== =\n"
testLevel+= "= ========== == ===== ==== =\n"
testLevel+= "= =   =   =       =        =\n"
testLevel+= "=   =   =   === =   =      =\n"
testLevel+= "= ==== ===== == ===== ==== =\n"
testLevel+= "= ==== ===== == ===== ==== =\n"
testLevel+= "=                          =\n"
testLevel+= "=            ==            =\n"
testLevel+= "= ==== ===== == ===== ==== =\n"
testLevel+= "= ==== ===== == ===== ==== =\n"
testLevel+= "=                          =\n"
testLevel+= "=            ==            =\n"
testLevel+= "= ==== ===== == ===== ==== =\n"
testLevel+= "= ==== ===== == ===== ==== =\n"
testLevel+= "=                          =\n"
testLevel+= "=            ==            =\n"
testLevel+= "= ==== ===== == ===== ==== =\n"
testLevel+= "= ==== ===== == ===== ==== =\n"
testLevel+= "=                          =\n"
testLevel+= "=            ==            =\n"
testLevel+= "= ==== ===== == ===== ==== =\n"
testLevel+= "= ==== ===== == ===== ==== =\n"
testLevel+= "=                          =\n"
testLevel+= "============================\n"

function HoboMan(canvas) {
    this.canvas = canvas;
    this.InitCanvas();
    this.level = new Level(testLevel);

    this.level.render(this.ctx);
    this.hobo = new Hobo(0, 0);
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
    this.update();
    this.render();

    setTimeout(_.bind(this.loop, this), 16);
};

HoboMan.prototype.update = function() {
    this.hobo.update(this.keys);
};

HoboMan.prototype.render = function() {
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.ctxWidth, this.ctxHeight);
    this.level.render(this.ctx);
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
