function DogRenderer() {
    this.file = "resources/images/dog.png";
    this.height = 16;
    this.width = 16;
    this.spriteImage = new Image();
    this.spriteImage.src = this.file;
    this.accumulator = 0;
}

DogRenderer.totalAnimationTime = 0.4;
DogRenderer.numFrames = 4;

DogRenderer.frameMapping = [0, 1, 0 ,2];

DogRenderer.prototype.getDirectionOffset = function(dog){
    switch (dog.direction) {
        case 'left': return 48;
        case 'up': return 32;
        case 'right': return 16;
        case 'down': return 0;
        default: return 0;
    }
};

DogRenderer.prototype.update = function(dt) {
    this.accumulator += dt;
    while (this.accumulator > DogRenderer.totalAnimationTime) {
        this.accumulator -= DogRenderer.totalAnimationTime;
    }
};

DogRenderer.prototype.getAnimationOffset = function(){
    var frame = Math.floor(this.accumulator / (DogRenderer.totalAnimationTime / DogRenderer.numFrames));

    return DogRenderer.frameMapping[frame] * this.height;
};

DogRenderer.prototype.drawFrame = function(context, dog){
    context.drawImage(this.spriteImage, this.getDirectionOffset(dog), this.getAnimationOffset(), this.width, this.height, Math.floor(dog.x), Math.floor(dog.y)- 4, Dog.SIZE.w, Dog.SIZE.h);
};
