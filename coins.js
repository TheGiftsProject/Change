function Coins(world) {
    this.file = "resources/images/coins.png";
    this.height = 16;
    this.width = 16;
    this.sprite = new Image();
    this.sprite.src = this.file;
    this.coins = {};
    this.place(world);
    SoundJS.add("coin", "resources/sound/coin.wav",5);
}

Coins.prototype.place = function(world){
    var rand;
    // values need to be changed according to world size - coins should be generated with the block.
    for (var i = 0; i < 100 ; i++){
        for (var j = 0; j < 100 ; j++){
            if (i==0 && j==0) continue;
            if (world.getCellAt(i,j).isPath()){
                rand = Math.floor(Math.random()*10);
                if (rand >= 7) continue;
                var type = 2;
                if (rand > 0 && rand < 3) type = 1;
                if (rand ==0) type = 0;

                var coin = new Coin(i, j, type, this);
                this.coins[[i,j]] = coin;
            }
        }
    }
};

Coins.prototype.pickup = function(hobo){
    var tileX = Math.floor(hobo.y / 16);
    var tileY = Math.floor(hobo.x / 16);

    if ([tileX,tileY] in this.coins){
        hobo.addPoints(this.coins[[tileX,tileY]].points());
        delete this.coins[[tileX,tileY]];
        SoundJS.play("coin");
    }
};

Coins.prototype.update = function(dt){
    for (var i in this.coins){
        this.coins[i].update(dt);
    }
};

Coins.prototype.render = function(context){
    for (var i in this.coins){
        this.coins[i].render(context);
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
    this.accimulator = 1;
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

Coin.prototype.points = function(){
    switch(this.type){
        case 0: return 10;
        case 1: return 5;
        case 2: return 1;
        default:
            return 0;
    }
};