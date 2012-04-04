function HoboAnimation() {
    this.file = "resources/images/hobo.png";
    this.height = 16;
    this.width = 16;
    this.spriteImage = new Image();
    this.spriteImage.src = this.file;
    this.accumulator = 0;
    this.lastX = null;
    this.lastY = null;
}

HoboAnimation.totalAnimationTime = 0.4;
HoboAnimation.numFrames = 4;

HoboAnimation.frameMapping = [0, 1, 0 ,2];

HoboAnimation.prototype.getDirectionOffset = function(hobo){
    switch (hobo.direction) {
        case 'left': return 48;
        case 'up': return 32;
        case 'right': return 16;
        case 'down': return 0;
        default: return 0;
    }
};

HoboAnimation.prototype.update = function(dt) {
    this.accumulator += dt;
    while (this.accumulator > HoboAnimation.totalAnimationTime) {
        this.accumulator -= HoboAnimation.totalAnimationTime;
    }
};

HoboAnimation.prototype.getAnimationOffset = function(hobo){
    var frame = Math.floor(this.accumulator / (HoboAnimation.totalAnimationTime / HoboAnimation.numFrames));
    if (hobo.x == this.lastX && hobo.y == this.lastY){
        frame = 0;
    } else {
        this.lastX = hobo.x;
        this.lastY = hobo.y;
    }
    return HoboAnimation.frameMapping[frame] * this.height;
};

HoboAnimation.prototype.drawFrame = function(context, hobo){
    var x = Math.floor(hobo.x),
        y = Math.floor(hobo.y);
    context.drawImage(this.spriteImage, this.getDirectionOffset(hobo), this.getAnimationOffset(hobo) + (hobo.powerup + 1) * 48, this.width, this.height, x, y - 6, Hobo.SIZE.w, Hobo.SIZE.h);
};
