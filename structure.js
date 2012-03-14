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

World.prototype.collectAt = function(global_row, global_col) {
    var global_coord = new Coord(global_row, global_col);
    var pattern_coord = Pattern.translateGlobalToPattern(global_coord);
    var internal_coord = Pattern.translateGlobalToInternal(global_coord);

    var pattern = this.getPatternAt(pattern_coord);
    pattern.collectAt(internal_coord);
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

    var pattern = new Pattern(top_connected, right_connected, bottom_connected, left_connected);

    if (!this.patternsMatrix[coord.row]) {
        this.patternsMatrix[coord.row] = {};
    }

    this.patternsMatrix[coord.row][coord.col] = pattern;
    return pattern;

};

/* ================================================= CELL ================================================= */
function Cell(isWall, content) {
  this.wall    = isWall;
  this.content = content;
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

Cell.prototype.hasContent = function() {
    return this.content !== null;
}

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
function Pattern(top, right, bottom, left)
{
    this.top    = top;
    this.right  = right;
    this.bottom = bottom;
    this.left   = left;

    this.middle_content = this.generateRandomContent();
    this.top_content    = this.generateRandomContent();
    this.right_content  = this.generateRandomContent();
    this.bottom_content = this.generateRandomContent();
    this.left_content   = this.generateRandomContent();
}

Pattern.CONTENT_CHANCE = 0.5;

Pattern.prototype.collectAt = function(coord) {
    if (this.inCenter(coord.row) && this.inCenter(coord.col)) {
        this.middle_content = null;
    }
    else if (this.top && this.beforeCenter(coord.row) && this.inCenter(coord.col)) {
        this.top_content = null;
    }
    else if (this.bottom && !this.beforeCenter(coord.row) && this.inCenter(coord.col)) {
        this.bottom_content = null;
    }
    else if (this.left && this.beforeCenter(coord.col) && this.inCenter(coord.row)) {
        this.left_content = null;
    }
    else if (this.right && !this.beforeCenter(coord.col) && this.inCenter(coord.row)) {
        this.right_content = null;
    }
}

Pattern.prototype.generateRandomContent = function()
{
    if (Math.roll(Pattern.CONTENT_CHANCE)) {
        return Math.floor(Math.random() * 3);
    }
    return null;
}

Pattern.prototype.inCenter = function(index) {
    return index == 1;
}

Pattern.prototype.beforeCenter = function(index) {
    return index == 0;
}

Pattern.prototype.internalCellAt = function(coord) {
    var isWall;
    var content;

    if (this.inCenter(coord.row) && this.inCenter(coord.col)) {
        isWall  = false;
        content = this.middle_content;
    }
    else if (!(this.inCenter(coord.row) || this.inCenter(coord.col))) {
       isWall  = true;
       content = null;
    }
    else if (this.top && this.beforeCenter(coord.row) && this.inCenter(coord.col)) {
        isWall  = false;
        content = this.top_content;
    }
    else if (this.bottom && !this.beforeCenter(coord.row) && this.inCenter(coord.col)) {
        isWall  = false;
        content = this.bottom_content;
    }
    else if (this.left && this.beforeCenter(coord.col) && this.inCenter(coord.row)) {
        isWall  = false;
        content = this.left_content;
    }
    else if (this.right && !this.beforeCenter(coord.col) && this.inCenter(coord.row)) {
        isWall  = false;
        content = this.right_content;
    }
    else {
        isWall  = true;
        content = null;
    }

    return new Cell(isWall, content);
};

Pattern.translateGlobalToPattern = function(coord) {
    var pattern_row = Math.floor(coord.row / 3);
    var pattern_col = Math.floor(coord.col / 3);
    return new Coord(pattern_row, pattern_col);
};

Pattern.translateGlobalToInternal = function(coord) {
    var internal_row = coord.row.mod(3);
    var internal_col = coord.col.mod(3);
    return new Coord(internal_row, internal_col);
};
