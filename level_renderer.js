function LevelRenderer() {
    this.file = "resources/images/borders.png";
    this.file2 = "resources/images/roads.png";
    this.height = 16;
    this.width = 16;
    this.wall = new Image();
    this.wall.src = this.file;
    this.road = new Image();
    this.road.src = this.file2;
    this.tileRenderers = {};
}

LevelRenderer.prototype.renderTile = function(row, col, world, context, render_row, render_col){
	if (!([row,col] in this.tileRenderers)) {
		this.tileRenderers[[row,col]] = new TileRenderer(row, col, world, context, this);
	}
	this.tileRenderers[[row,col]].render(render_row,render_col);
};

