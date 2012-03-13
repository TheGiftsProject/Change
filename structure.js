/* ================================================= WORLD ================================================= */
function World() {
  this.patternsMatrix = {};
}

World.prototype.getPatternAt = function(coord) {
    if (!this.patternsMatrix[coord.row] || !this.patternsMatrix[coord.row][coord.col]) {
        return null;
    }
    return this.patternsMatrix[coord.row][coord.col];
}

World.prototype.getCellAt = function(global_row, global_col) {
    var global_coord = new Coord(global_row, global_col);
  
    var pattern_coord = Pattern.translateGlobalToPattern(global_coord);
    var internal_coord = Pattern.translateGlobalToInternal(global_coord);

    var pattern = this.getPatternAt(pattern_coord);
    if (!pattern) {
        pattern = this.generatePatternFor(new Coord(pattern_coord.row, pattern_coord.col));
    }

    return pattern.internalCellAt(internal_coord);
};

World.CONNECTION_CHANCES = [1.0,  1.0,  0.05, 0.01];

World.prototype.generatePatternFor = function(coord) {
    var top_pattern    = this.getPatternAt(coord.top());
    var right_pattern  = this.getPatternAt(coord.right());
    var bottom_pattern = this.getPatternAt(coord.bottom());
    var left_pattern   = this.getPatternAt(coord.left());
	
	var top_exists    = top_pattern    ? true : false;
    var right_exists  = right_pattern  ? true : false;
    var bottom_exists = bottom_pattern ? true : false;
    var left_exists   = left_pattern   ? true : false;
	
	var connections = 0;
	
    var top_connected    = top_pattern    ? top_pattern.bottom : false;
    var right_connected  = right_pattern  ? right_pattern.left : false;
    var bottom_connected = bottom_pattern ? bottom_pattern.top : false;
    var left_connected   = left_pattern   ? left_pattern.right : false;
	
	var top_connected    = top_exists    ? top_pattern.bottom : false;
    if (top_connected) connections++;

    var right_connected  = right_exists  ? right_pattern.left : false;
    if (right_connected) connections++;

    var bottom_connected = bottom_exists ? bottom_pattern.top : false;
    if (bottom_connected) connections++;

    var left_connected   = left_exists   ? left_pattern.right : false;
    if (left_connected) connections++;
	
    var connection_chances = World.CONNECTION_CHANCES.slice(0, 4 - connections).shuffle();

    var new_connections = 0;

    if (!top_exists || top_connected) {
        top_connected = top_connected || Math.roll(connection_chances[new_connections]);
        new_connections++;
    }

    if (!right_exists || right_connected) {
        right_connected = right_connected || Math.roll(connection_chances[new_connections]);
        new_connections++;
    }

    if (!bottom_exists | bottom_connected) {
        bottom_connected = bottom_connected || Math.roll(connection_chances[new_connections]);
        new_connections++;
    }

    if (!left_exists || left_connected) {
        left_connected = left_connected || Math.roll(connection_chances[new_connections]);
    }	

    var pattern = new Pattern(top_connected, right_connected, bottom_connected, left_connected, coord);

    if (!this.patternsMatrix[coord.row]) {
        this.patternsMatrix[coord.row] = {};
    }

    this.patternsMatrix[coord.row][coord.col] = pattern;
    return pattern;

};

/* ================================================= CELL ================================================= */
function Cell(isWall) {
  this.wall = isWall;
}

Cell.prototype.setAsPath = function() {
    this.wall = false;
};

Cell.prototype.isWall = function() {
    return this.wall;
};

Cell.prototype.isPath = function() {
    return !this.wall;
};

/* ================================================= COORDS ================================================= */
function Coord(row, col) {
    this.row = row;
    this.col = col;
}

Coord.prototype.top = function() {
    return new Coord(this.row-1, this.col);
};

Coord.prototype.bottom = function() {
    return new Coord(this.row+1, this.col);
};

Coord.prototype.left = function() {
    return new Coord(this.row, this.col-1);
};

Coord.prototype.right = function() {
    return new Coord(this.row, this.col+1);
};

/* ================================================= PATTERN ================================================= */
function Pattern(top, right, bottom, left, coord)
{
    this.top    = top;
    this.right  = right;
    this.bottom = bottom;
    this.left   = left;
    this.coord  = coord;
}

Pattern.SIZE   = 3; // must be an ODD number!
Pattern.MIDDLE = Math.floor(Pattern.SIZE * 0.5);

Pattern.prototype.inCenter = function(index) {
    return index == Pattern.MIDDLE;
}

Pattern.prototype.inBefore = function(index) {
    return index < Pattern.MIDDLE;
}

Pattern.prototype.internalCellAt = function(coord) {
    var isWall;

    if (this.inCenter(coord.row) && this.inCenter(coord.col)) {
        isWall = false;
    }
    else if (!(this.inCenter(coord.row) || this.inCenter(coord.col))) {
       isWall = true;
    }
    else if (this.top && this.inBefore(coord.row) && this.inCenter(coord.col)) {
        isWall = false;
    }
    else if (this.bottom && !this.inBefore(coord.row) && this.inCenter(coord.col)) {
        isWall = false;
    }
    else if (this.left && this.inBefore(coord.col) && this.inCenter(coord.row)) {
        isWall = false;
    }
    else if (this.right && !this.inBefore(coord.col) && this.inCenter(coord.row)) {
        isWall = false;
    }
    else {
        isWall = true;
    }

    return new Cell(isWall);
};

Pattern.translateGlobalToPattern = function(coord) {
    var pattern_row = Math.floor(coord.row / Pattern.SIZE);
    var pattern_col = Math.floor(coord.col / Pattern.SIZE);
    return new Coord(pattern_row, pattern_col);
};

Pattern.translateGlobalToInternal = function(coord) {
    var internal_row = coord.row.mod(Pattern.SIZE);
    var internal_col = coord.col.mod(Pattern.SIZE);
    return new Coord(internal_row, internal_col);
};
