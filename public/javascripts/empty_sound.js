function EmptySound(filename){
    this.filename = filename;
}

EmptySound.prototype.load = function(){
    return soundManager.createSound({ id: this.filename, url:'/resources/sound/' + this.filename});
};

EmptySound.prototype.play = function(){
};