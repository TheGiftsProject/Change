var testLevel;
testLevel = "============================\n"
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

    document.body.addListener('keydown', _.bind(this.updateKeys, this));
    document.body.addListener('keyup', _.bind(this.updateKeys, this));
}

HoboMan.prototype.loop = function() {
    this.update();
    this.render();
};

HoboMan.prototype.update = function() {
    this.hobo.update(this.keys);
};

HoboMan.prototype.render = function() {
    this.level.render(this.ctx);
    this.hobo.render(this.ctx);
};

HoboMan.prototype.InitCanvas = function() {
    this.ctx = this.canvas.getContext("2d");
};

hoboman = new HoboMan(document.getElementsByTagName('canvas')[0]);
