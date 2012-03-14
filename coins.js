Coins.prototype.update = function(dt){
    for (var i in this.coins){
        this.coins[i].update(dt);
    }
};

//0-gold, 1-silver, 2-bronze
function Coin(x,y, type,coins){
    this.height = coins.height;
    this.width = coins.width;
    this.sprite = coins.sprite;
    this.x = x;
    this.y = y;
    this.type = type;
    this.collected = false;
    this.accimulator = Math.floor(Math.random() * 60);
}

Coin.prototype.update = function(dt){
    this.accimulator = (this.accimulator + dt) % 60;
};

Coin.prototype.render = function(context){
    if (this.collected == true) return;
    var tmp = Math.floor((this.accimulator*5) % 4);
    var animation = (tmp % 2) ? 0 : Math.floor(tmp/2)+1;
    context.drawImage(this.sprite, animation * this.width, this.type * this.height, this.width, this.height, this.y*this.height,this.x*this.width, this.width, this.height);
};

