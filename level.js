function Level(world) {
    this.world = world;
    this.renderer = new LevelRenderer();
}

Level.CELL_SIZE = {
    WIDTH: 16,
    HEIGHT: 16
};

Level.CELL_COLOR = {
    WALL:  "#000000",
    PATH: "#FFFFFF"
};

Level.prototype.render = function(ctx, viewport) {
    ctx.strokeStyle = "#000000";

    var cell_width = Level.CELL_SIZE.WIDTH;
    var cell_height = Level.CELL_SIZE.HEIGHT;

    var startRow = Math.ceil(viewport.y / cell_height) - 1;
    var startCol = Math.ceil(viewport.x / cell_width) - 1;

    var cols = Math.ceil(viewport.width / cell_width) + 1;
    var rows = Math.ceil(viewport.height / cell_height) + 1;

    for (var row = 0; row < rows; ++row) {
        for (var col = 0; col < cols; ++col) {
            this.renderer.renderTile(startRow + row, startCol + col, this.world, ctx);
        }
    }
};
