function Level(world) {
    this.world = world;
}

Level.CELL_SIZE = {
    w: 16,
    h: 16
};

Level.prototype.render = function(ctx, width, height) {
    ctx.strokeStyle = "#000000";

    // TODO: should get these values according to Hobo location.
    var block_row = -1;
    var block_col = -1;

    var cell_width = Level.CELL_SIZE.w;
    var cell_height = Level.CELL_SIZE.h;

    for (var row = 0, rowLen = this.world.blockSize; row < rowLen; ++row) {
        for (var col = 0, colLen = this.world.blockSize; col < colLen; ++col) {
            ctx.strokeStyle = "#000000";
            ctx.fillStyle = (this.world.getBlockAt(block_row, block_col).getCellAt(row, col).isWall() ? "#000000" : "#FFFFFF");
            ctx.strokeRect(cell_width * col, cell_height * row, cell_width, cell_height);
            ctx.fillRect(cell_width * col, cell_height * row, cell_width, cell_height);
        }
    }
};
