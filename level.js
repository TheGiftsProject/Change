function Level(world) {
    this.world = world;
}

Level.CELL_SIZE = {
    WIDTH: 20,
    HEIGHT: 20
};

Level.CELL_COLOR = {
    WALL:  "#000000",
    PATH: "#FFFFFF"
}

Level.prototype.render = function(ctx, width, height) {
    ctx.strokeStyle = "#000000";

    // TODO: should get these values according to Hobo location.
    var initial_row = -10;
    var initial_col = -10;

    var cell_width = Level.CELL_SIZE.WIDTH;
    var cell_height = Level.CELL_SIZE.HEIGHT;

    var rows = Math.ceil(width / cell_width);
    var cols = Math.ceil(height / cell_height);

    for (var row = 0; row < rows; ++row) {
        for (var col = 0; col < cols; ++col) {
            ctx.strokeStyle = "#808080";
            ctx.fillStyle = (this.world.getCellAt(initial_row + row, initial_col + col).isWall() ? Level.CELL_COLOR.WALL : Level.CELL_COLOR.PATH);
            ctx.strokeRect(cell_width * col, cell_height * row, cell_width, cell_height);
            ctx.fillRect(cell_width * col, cell_height * row, cell_width, cell_height);
        }
    }
};
