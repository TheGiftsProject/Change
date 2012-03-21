function LevelRenderer() {
    this.height = 16;
    this.width = 16;
    this.wall = new Image();
    this.wall.src = "resources/images/wall.png";
    this.road = new Image();
    this.road.src = "resources/images/roads.png";
    this.wallBottom = new Image();
    this.wallBottom.src = "resources/images/road-side.png";
    this.roof = new Image();
    this.roof.src = "resources/images/roof.png";
    this.coins = new Image();
    this.coins.src = "resources/images/coins.png";
    this.tileRenderers = {};
    this.accumulator = Math.floor(Math.random() * 60);
}

LevelRenderer.prototype.update = function(dt) {
    this.accumulator = (this.accumulator + dt) % 60;
}

LevelRenderer.prototype.renderTile = function(row, col, world, context){
    if (!([row,col] in this.tileRenderers)) {
    this.tileRenderers[[row,col]] = new TileRenderer(row, col, world, context, this);
    }
this.tileRenderers[[row,col]].render(row, col);
};
