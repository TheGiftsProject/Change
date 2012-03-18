/* ================================================= WORLD ================================================= */
function World() {
    this.patternsMatrix = {};
}

World.prototype.getPatternAt = function(coord) {
    if (!this.patternsMatrix[coord.row] || ! this.patternsMatrix[coord.row][coord.col]) {
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

World.VARIANCE_CHANCE = 2;

World.prototype.generatePatternFor = function(coord) {

    /**
     * builds a 4 number sequance, e.g [1.0, 0.8, 0.2, 0.1]
     */
    function rollChanceFromValue() {

        // total value of the sequance
        var totalValue = 4.5;

        // we set this to higher value then 1 so that the 1st run will have a better chance of being connected
        var maxLimit = 1.3;

        // the max amount to reduce from the upper bound each run
        var jumpLimit = 0.1;

        var result = 0;

        return function() {
            if (totalValue > 0) {
                result = Math.max(0, Math.randomRange(0, maxLimit));
                maxLimit = Math.max(0, maxLimit - Math.randomRange(0, jumpLimit));
                totalValue = totalValue - result; // save for next time
            }
            return result;
        }
    }

    // this instance is called at most 4 times
    var rollChance = rollChanceFromValue();

    function takeAChance() {
        return Math.roll(rollChance());
    }

    var revert_side = {
        'top': 'bottom',
        'right': 'left',
        'bottom': 'top',
        'left': 'right'
    };

    var that = this;
    function isSideConnected(side) {
        var pattern = that.getPatternAt(coord[side]());
        var exists = pattern ? true: false;
        var connected = exists ? pattern[revert_side[side]] : false;
        if (!exists || connected) {
            connected = connected || takeAChance();
        }
        return connected;
    }

    var pattern = new Pattern(isSideConnected('top'), isSideConnected('right'), isSideConnected('bottom'), isSideConnected('left'));

    if (!this.patternsMatrix[coord.row]) {
        this.patternsMatrix[coord.row] = {};
    }

    this.patternsMatrix[coord.row][coord.col] = pattern;
    return pattern;

};

/* ================================================= CELL ================================================= */
function Cell(isWall, content) {
    this.wall = isWall;
    this.content = content;
}

Cell.prototype.setAsPath = function() {
    this.wall = false;
};

Cell.prototype.isWall = function() {
    return this.wall;
};

Cell.prototype.isPath = function() {
    return ! this.wall;
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

/* ================================================= PATTERN ================================================= */
function Pattern(top, right, bottom, left) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;

    this.middle_content = this.generateRandomContent();
    this.top_content = this.generateRandomContent();
    this.right_content = this.generateRandomContent();
    this.bottom_content = this.generateRandomContent();
    this.left_content = this.generateRandomContent();
}

Pattern.CONTENT_CHANCE = 0.5;

Pattern.prototype.collectAt = function(coord) {
    if (this.inCenter(coord.row) && this.inCenter(coord.col)) {
        this.middle_content = null;
    }
    else if (this.top && this.beforeCenter(coord.row) && this.inCenter(coord.col)) {
        this.top_content = null;
    }
    else if (this.bottom && ! this.beforeCenter(coord.row) && this.inCenter(coord.col)) {
        this.bottom_content = null;
    }
    else if (this.left && this.beforeCenter(coord.col) && this.inCenter(coord.row)) {
        this.left_content = null;
    }
    else if (this.right && ! this.beforeCenter(coord.col) && this.inCenter(coord.row)) {
        this.right_content = null;
    }
}

Pattern.prototype.generateRandomContent = function() {
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
        isWall = false;
        content = this.middle_content;
    }
    else if (! (this.inCenter(coord.row) || this.inCenter(coord.col))) {
        isWall = true;
        content = null;
    }
    else if (this.top && this.beforeCenter(coord.row) && this.inCenter(coord.col)) {
        isWall = false;
        content = this.top_content;
    }
    else if (this.bottom && ! this.beforeCenter(coord.row) && this.inCenter(coord.col)) {
        isWall = false;
        content = this.bottom_content;
    }
    else if (this.left && this.beforeCenter(coord.col) && this.inCenter(coord.row)) {
        isWall = false;
        content = this.left_content;
    }
    else if (this.right && ! this.beforeCenter(coord.col) && this.inCenter(coord.row)) {
        isWall = false;
        content = this.right_content;
    }
    else {
        isWall = true;
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

