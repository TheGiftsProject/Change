function LevelRenderer() {
    this.file = "resources/images/borders2.png";
    this.file2 = "resources/images/roads.png";
    this.file3 = "resources/images/road-side.png";
    this.file4 = "resources/images/coins.png";
    this.height = 16;
    this.width = 16;
    this.wall = new Image();
    this.wall.src = this.file;
    this.road = new Image();
    this.road.src = this.file2;
    this.wallBottom = new Image();
    this.wallBottom.src = this.file3;
    this.coins = new Image();
    this.coins.src = this.file4;
    this.tileRenderers = {};
}

LevelRenderer.prototype.renderTile = function(row, col, world, context){
    if (!([row,col] in this.tileRenderers)) {
        this.tileRenderers[[row,col]] = new TileRenderer(row, col, world, context, this);
    }
    this.tileRenderers[[row,col]].render(row, col);
};

