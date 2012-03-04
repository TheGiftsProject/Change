function Level(levelDesc) {
    this.parse(levelDesc);
}

Level.CELL_SIZE = {
    w: 16,
    h: 16
};

Level.prototype.parse = function(levelDesc) {
    this.level = [];
    var rows = levelDesc.split('\n');
    for (var i = 0, length = rows.length; i < length ; ++i) {
        row = [];
        for (var j = 0, strLen = rows[i].length; j < strLen; ++j) {
            row.push(rows[i][j]);
        }

        this.level.push(row);
    }
};

Level.prototype.render = function(ctx) {
    for (var row = 0, rowLen = this.level.length; row < rowLen; ++row) {
        for (var col = 0, colLen = this.level[row].length; col < colLen; ++col) {
            ctx.fillStyle = (this.level[row][col] == Cell.TYPES.WALL ? "#000000" : "#FFFFFF");
            ctx.fillRect(Level.CELL_SIZE.w * col, Level.CELL_SIZE.h * row, Level.CELL_SIZE.w, Level.CELL_SIZE.h);
        }
    }
};
