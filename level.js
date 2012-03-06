function Level(world, from_block_row, from_block_col) {
    this.world = world;
    this.current_block_row = from_block_row;
    this.current_block_col = from_block_col;
}

Level.CELL_SIZE = {
    w: 16,
    h: 16
};

Level.prototype.render = function(ctx) {
    ctx.strokeStyle = "#000000";

    var block_row = this.current_block_row;
    var block_col = this.current_block_col;
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
