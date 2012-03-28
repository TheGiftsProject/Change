function Coord(row, col) {
    this.row = row;
    this.col = col;
};

Coord.prototype.top = function() {
    return new Coord(this.row - 1, this.col);
};

Coord.prototype.bottom = function() {
    return new Coord(this.row + 1, this.col);
};

Coord.prototype.left = function() {
    return new Coord(this.row, this.col - 1);
};

Coord.prototype.right = function() {
    return new Coord(this.row, this.col + 1);
};

Coord.prototype.toLevelCoords = function() {
    return new Coord(Level.CELL_SIZE.WIDTH * (this.row * 3 + 1), Level.CELL_SIZE.HEIGHT * (this.col * 3 + 1));
};
