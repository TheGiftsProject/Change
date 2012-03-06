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
    var block_row = this.current_block_row;
    var block_col = this.current_block_col;
    for (var row = 0, rowLen = this.world.blockSize; row < rowLen; ++row) {
        for (var col = 0, colLen = this.world.blockSize; col < colLen; ++col) {
            ctx.strokeStyle = "#000000";
            ctx.fillStyle = (this.world.getBlockAt(block_row, block_col).getCellAt(row, col).type == Cell.TYPES.WALL ? "#000000" : "#FFFFFF");
            ctx.strokeRect(Level.CELL_SIZE.w * col, Level.CELL_SIZE.h * row, Level.CELL_SIZE.w, Level.CELL_SIZE.h);
            ctx.fillRect(Level.CELL_SIZE.w * col, Level.CELL_SIZE.h * row, Level.CELL_SIZE.w, Level.CELL_SIZE.h);
        }
    }
};
