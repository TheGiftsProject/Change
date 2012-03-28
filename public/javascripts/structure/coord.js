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
    console.log(this.row, this.col);
    return new Coord(this.row * 48 + 16, this.col * 48 + 16);
};
