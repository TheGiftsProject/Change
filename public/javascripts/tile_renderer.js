function TileRenderer(row, col, world, context, renderer){
    this.row = row;
    this.col = col;
    this.world = world;
    this.context = context;
    this.renderer = renderer;
    this.neighbours = [
        [world.getCellAt(row - 1, col -1), world.getCellAt(row - 1, col), world.getCellAt(row - 1, col +1)],
        [world.getCellAt(row    , col -1), world.getCellAt(row    , col), world.getCellAt(row    , col +1)],
        [world.getCellAt(row + 1, col -1), world.getCellAt(row + 1, col), world.getCellAt(row + 1, col +1)]
        ];
    this.cell = world.getCellAt(row    , col);
    this.wallDecal = null;
    this.roofDecal = null;
    if (this.fits([[2,2,2],
                   [2,1,2],
                   [2,0,2]]) && Math.random() > 0.5){
        this.wallDecal = Math.floor(Math.random() * TileRenderer.DECALS.wall);
    }
    if (this.fits([[2,2,2],
                   [2,1,2],
                   [2,1,2]]) && Math.random() > 0.8){
        this.roofDecal = Math.floor(Math.random() * TileRenderer.DECALS.roof);
    }
    this.coin_offset = Math.random() * 60;
    this.brokenDecal = Math.floor(Math.random() * 3);
}
TileRenderer.DECALS = {
    roof: 7,
    wall: 5
};

TileRenderer.prototype.isWall = function(x,y){
    return this.neighbours[x+1][y+1].isWall();
};

TileRenderer.prototype.isPath = function(x,y){
    return this.neighbours[x+1][y+1].isPath();
};

TileRenderer.prototype.fits = function(arr){
    for (var i = 0 ; i < arr.length; i++){
        for (var j = 0 ; j < arr[i].length ; j++){
            var command = arr[i][j]; //0-path, 1-wall, 2-any
            var x = i - 1;
            var y = j - 1;
            if (command == 0 && this.isWall(x, y)) return false;
            if (command == 1 && this.isPath(x, y)) return false;
        }
    }
    return true;
};

TileRenderer.prototype.blit = function(sprite, srcX, srcY){
    this.context.drawImage(sprite, srcX, srcY, 16, 16, this.render_col*16, this.render_row*16, 16, 16);
};

TileRenderer.prototype.render = function(render_row, render_col){
    this.render_row = render_row;
    this.render_col = render_col;
    if (this.isWall(0,0)) {
        this.renderWall();
    } else {
        this.renderRoad();
    }
    var cell = this.world.getCellAt(this.row, this.col);
    if (cell.hasContent()) {
        if (cell.content.isCoin()) {
            this.renderCoin(cell.content.value);
        }
        else if (cell.content.isPowerup()) {
            this.renderPowerup(cell.content.value)
        } else if (cell.content.isLife()){
            this.renderLife(cell.content.value)
        }
    }
};

TileRenderer.prototype.renderCoin = function(content_type) {
    this.coin_frame = this.coin_offset + this.renderer.accumulator;
    var tmp = Math.floor((this.coin_frame * 5) % 4);
    var animation = (tmp % 2) ? 0 : Math.floor(tmp/2)+1;
    this.blit(this.renderer.coins, 16 * animation, 16 * content_type)
}

TileRenderer.prototype.renderPowerup = function(content_type) {
    var tmp = Math.floor((this.renderer.accumulator*5) % 4);
    var animation = (tmp % 2) ? 0 : Math.floor(tmp/2)+1;
    this.blit(this.renderer.coins, 16 * animation, 16 * content_type + 64)
}
TileRenderer.prototype.renderLife = function(content_type) {
    var tmp = Math.floor((this.renderer.accumulator*5) % 4);
    var animation = [0,1,2,1][tmp];
    this.blit(this.renderer.coins, 16 * animation, 16 * content_type + 112)
};

TileRenderer.prototype.renderWall = function(){
    var idx = 0;
    if (this.isPath(-1,0))  idx += 1;
    if (this.isPath(0,1))   idx += 2;
    if (this.isPath(1,0))   idx += 4;
    if (this.isPath(0,-1))  idx += 8;
    this.blit(this.renderer.wall, 0 , idx * 16);

    if (this.fits([[0,1,2],
                   [1,2,2],
                   [2,2,2]])){
        this.blit(this.renderer.wall, 0, 256 + 0 * 16);
    }
    if (this.fits([[2,1,0],
                   [2,2,1],
                   [2,2,2]])){
        this.blit(this.renderer.wall, 0, 256 + 1 * 16);
    }

    if (this.fits([[2,2,2],
                   [2,2,1],
                   [2,1,0]])){
        this.blit(this.renderer.wall, 0, 256 + 2 * 16);
    }
    if (this.fits([[2,2,2],
                   [1,2,2],
                   [0,1,2]])){
        this.blit(this.renderer.wall, 0, 256 + 3 * 16);
    }

    if (this.wallDecal != null){
        this.blit(this.renderer.wallBottom, 0,  this.wallDecal * 16);
    }
    if (this.roofDecal != null){
        this.blit(this.renderer.roof, 0,  this.roofDecal * 16);
    }

};

TileRenderer.prototype.renderRoad = function(){
    if (this.cell.broken) {
        this.blit(this.renderer.road, this.brokenDecal*16, 48);
        return;
    }
    this.blit(this.renderer.road, 32, 0);
    this.renderLines();
    this.renderStops();
    this.renderSewage();
    if (this.fits([[1,1,1],
                   [1,2,1],
                   [1,1,1]])){
        this.blit(this.renderer.road, 32, 32);
    }
};

TileRenderer.prototype.renderStops = function(){
    if (this.fits([[2,0,0],
                   [2,2,1],
                   [2,0,2]])){
        this.blit(this.renderer.road, 0, 32);
        return;
    }
    if (this.fits([[2,0,2],
                   [1,2,2],
                   [0,0,2]])){
        this.blit(this.renderer.road, 0, 16);
        return;
    }
    if (this.fits([[2,2,2],
                   [0,2,0],
                   [2,1,0]])){
        this.blit(this.renderer.road, 16, 16);
        return;
    }
    if (this.fits([[0,1,2],
                   [0,2,0],
                   [2,2,2]])){
        this.blit(this.renderer.road, 32, 16);
        return;
    }
};

TileRenderer.prototype.renderSewage = function(){
    if (this.fits([[0,2,0],
                   [2,2,2],
                   [0,2,0]])){
        this.blit(this.renderer.road, 16, 32);
        return;
    }
};

TileRenderer.prototype.renderLines = function(){
    if (this.row % 2 ==0 && (
        this.fits([[2,0,2],
                   [2,2,1],
                   [2,0,2]]) || 
        this.fits([[2,0,2],
                   [1,2,2],
                   [2,0,2]]))){
        this.blit(this.renderer.road, 0, 0);
        return;
    }
    if (this.col % 2 ==0 && (
        this.fits([[2,1,2],
                   [0,2,0],
                   [2,2,2]]) || 
        this.fits([[2,2,2],
                   [0,2,0],
                   [2,1,2]]))){
        this.blit(this.renderer.road, 16, 0);
        return;
    }
};

