function Points(){
    this.points = [];
    this.accumulator = 0;
}

Points.TTL = 1;

Points.prototype.add = function(amount, x, y){
    this.points.push({x: x, y:y, text: amount, ttl: Points.TTL});
};

Points.prototype.update = function(dt){
    this.accumulator += dt;
    $(this.points).each(function(){
        this.ttl -= dt;
    });
};

Points.prototype.render = function(context){
    $(this.points).each(function(){
        if (this.ttl > 0){
            var opacity = Math.floor((this.ttl / Points.TTL)*100)/100;
            context.fillStyle = "rgba(175, 36, 255, " + opacity + ")";

            context.font = 'bold 8px monospace';
            context.textAlign = 'center';
            context.textBaseline = 'bottom';
            context.fillText(this.text, this.x + 8, this.y + 10);
        }
    });
};