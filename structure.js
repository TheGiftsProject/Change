/* ================================================= WORLD ================================================= */
function World() {
    this.patternsMatrix = {};
    this.cells = {};
};

World.prototype.getPatternAt = function(coord) {
    if (!this.patternsMatrix[coord.row] || !this.patternsMatrix[coord.row][coord.col]) {
        return null;
    }
    return this.patternsMatrix[coord.row][coord.col];
};

World.prototype.cellExists = function(global_row, global_col) {
    return this.cells[global_row] && this.cells[global_row][global_col];
};

World.prototype.addCellAt = function(cell, global_row, global_col) {
    if (!this.cells[global_row]) {
        this.cells[global_row] = {};
    }
    this.cells[global_row][global_col] = cell;
};

World.prototype.getCellAt = function(global_row, global_col) {
    if (!this.cellExists(global_row, global_col)) {
        var pattern_coord = Pattern.translateGlobalToPattern(global_row, global_col);
        pattern = this.generatePatternFor(new Coord(pattern_coord.row, pattern_coord.col));

        for (var internal_row = 0; internal_row < 3; internal_row++) {
            for (var internal_col = 0; internal_col < 3; internal_col++) {
                this.addCellAt(pattern.internalCellAt(internal_row, internal_col), pattern_coord.row * 3 + internal_row, pattern_coord.col * 3 + internal_col);
            }
        }
    }
    return this.cells[global_row][global_col];
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
function Cell(isWall) {
    this.wall = isWall;
    if (!isWall) {
        var roll = Math.random();
        if (roll > Cell.TOP_COIN_CHANCE) {
            this.content = new Content(Content.COIN, Content.COINS.TOP);
        }
        else if (roll > Cell.MID_COIN_CHANCE) {
            this.content = new Content(Content.COIN, Content.COINS.MID);
        }
        else if (roll > Cell.LOW_COIN_CHANCE) {
            this.content = new Content(Content.COIN, Content.COINS.LOW);
        }
        else {
            this.content = null;
        }
    }
    else {
        this.content = null;
    }
};

Cell.LOW_COIN_CHANCE = 0.4;
Cell.MID_COIN_CHANCE = 0.7;
Cell.TOP_COIN_CHANCE = 0.9;

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
};

Cell.prototype.removeContent = function() {
    return this.content = null;
};

/* ================================================= CONTENT ================================================= */
function Content(type, value) {
    this.type  = type;
    this.value = value;
};

// coins.
Content.COINS = {
    TOP: 0,
    MID: 1,
    LOW: 2
};

// types.
Content.COIN          = "coin";
Content.POWERUP_GOD   = "godmode";
Content.POWERUP_BONUS = "bonus";

Content.prototype.getValue = function() {
    if (this.type == Content.COIN) {
        switch (this.value) {
            case Content.COINS.TOP: return 10;
            case Content.COINS.MID: return 5;
            case Content.COINS.LOW: return 1;
        }
    }
    return 0;
};

Content.prototype.isCoin = function() {
    return this.type == Content.COIN;
}

/* ================================================= COORDS ================================================= */
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

/* ================================================= PATTERN ================================================= */
function Pattern(top, right, bottom, left) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
};

Pattern.prototype.inCenter = function(index) {
    return index == 1;
};

Pattern.prototype.beforeCenter = function(index) {
    return index == 0;
};

Pattern.prototype.internalCellAt = function(row, col) {
    var isWall;

    if (this.inCenter(row) && this.inCenter(col)) {
        isWall = false;
    }
    else if (! (this.inCenter(row) || this.inCenter(col))) {
        isWall = true;
    }
    else if (this.top && this.beforeCenter(row) && this.inCenter(col)) {
        isWall = false;
    }
    else if (this.bottom && ! this.beforeCenter(row) && this.inCenter(col)) {
        isWall = false;
    }
    else if (this.left && this.beforeCenter(col) && this.inCenter(row)) {
        isWall = false;
    }
    else if (this.right && ! this.beforeCenter(col) && this.inCenter(row)) {
        isWall = false;
    }
    else {
        isWall = true;
    }

    return new Cell(isWall);
};

Pattern.translateGlobalToPattern = function(row, col) {
    var pattern_row = Math.floor(row / 3);
    var pattern_col = Math.floor(col / 3);
    return new Coord(pattern_row, pattern_col);
};