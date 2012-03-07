function Level(world) {
    this.world = world;
    this.renderer = new LevelSprite();
}

Level.CELL_SIZE = {
    WIDTH: 16,
    HEIGHT: 16
};

Level.CELL_COLOR = {
    WALL:  "#000000",
    PATH: "#FFFFFF"
}

Level.prototype.render = function(ctx, width, height) {
    ctx.strokeStyle = "#000000";

    // TODO: should get these values according to Hobo location.
    var initial_row = -20;
    var initial_col = -20;

    var cell_width = Level.CELL_SIZE.WIDTH;
    var cell_height = Level.CELL_SIZE.HEIGHT;

    var rows = Math.ceil(width / cell_width);
    var cols = Math.ceil(height / cell_height);

    for (var row = 0; row < rows; ++row) {
        for (var col = 0; col < cols; ++col) {
            this.renderer.renderTile(initial_row + row, initial_col + col, this.world, ctx, row, col);    
        }
    }
};
