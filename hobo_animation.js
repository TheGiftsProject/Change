function HoboAnimation() {
    this.file = "resources/images/hobo.png";
    this.height = 16;
    this.width = 16;
    this.spriteImage = new Image();
    this.spriteImage.src = this.file;

}

HoboAnimation.prototype.getDirectionOffset = function(hobo){
    switch (hobo.direction) {
        case 'left': return 48;
        case 'up': return 32;
        case 'right': return 16;
        case 'down': return 0;
    }
};


HoboAnimation.prototype.getAnimationOffset = function(hobo){
    return 0;
};

HoboAnimation.prototype.drawFrame = function(context, hobo){
    context.drawImage(this.spriteImage, this.getDirectionOffset(hobo), this.getAnimationOffset(), this.width, this.height, hobo.x, hobo.y, Hobo.SIZE.w, Hobo.SIZE.h);
};
