function DogRenderer(dogType) {
    this.file = "resources/images/dog.png";
    this.height = 16;
    this.width = 16;
    this.spriteImage = new Image();
    this.spriteImage.src = this.file;
    this.accumulator = 0;
    this.dogType = dogType;
}

DogRenderer.totalAnimationTime = 0.4;
DogRenderer.numFrames = 4;

DogRenderer.frameMapping = [0, 1, 0 ,2];

DogRenderer.prototype.getDirectionOffset = function(dog){
    var offset = 0;
    switch (dog.direction) {
        case 'left': offset= 48; break;
        case 'up': offset= 32; break;
        case 'right': offset= 16; break;
        case 'down': offset= 0; break;
    }
    if (dog.isRunningAway() && !dog.hobo.flickerOn) offset += 64;
    return offset;
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
    context.drawImage(this.spriteImage, this.getDirectionOffset(dog),
        this.getAnimationOffset() + (this.height*this.dogType*3),
        this.width, this.height, Math.floor(dog.x), Math.floor(dog.y)- 4, Dog.SIZE.w, Dog.SIZE.h);
};
