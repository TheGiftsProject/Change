function HoboAnimation() {
	this.file = "/resources/images/hobo.png";
	this.height = 16;
	this.width = 16;
	this.spriteImage = new Image();
	this.spriteImage.src = this.file;

}

HoboAnimation.prototype.drawFrame = function(context, x, y, direction, animation){
	context.drawImage(this.spriteImage, 0, 0, this.width, this.height,x,y,this.width,this.height);
};