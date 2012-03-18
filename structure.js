/* ================================================= WORLD ================================================= */
function World() {
    this.patternsMatrix = {};
    this.cells = {};
};

World.prototype.getPatternAt = function(coord) {
    if (!this.patternsMatrix[coord.row] || ! this.patternsMatrix[coord.row][coord.col]) {
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


    var revert_side = {
        'top': 'bottom',
        'right': 'left',
        'bottom': 'top',
        'left': 'right'
    };

    var that = this;
    function isSideConnected(side, connection_chance) {
        var pattern = that.getPatternAt(coord[side]());
        var exists = pattern ? true: false;
        var connected = exists ? pattern[revert_side[side]] : false;
        if (!exists || connected) {
            connected = connected || connection_chance;
        }
        return connected;
    }


    function getPatternConnections(){

        var connections = {};
        var sides = ['top', 'right', 'bottom', 'left'].shuffle();

        // this instance is called at most 4 times
        var sequence_popper = Math.sequenceBuilder(4.5, 1.3, 0.1);

        _.each( sides, function(side){
            connections[side] = isSideConnected(side, Math.roll( sequence_popper() ) );
        });

        return connections;
    }

    var pattern = new Pattern( getPatternConnections() );

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
        this.content = null;
    }
}


Cell.COIN_CHANCE = 0.5;

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
function Content(type) {
}

Content.COIN          = "coin";
Content.POWERUP_GOD   = "godmode";
Content.POWERUP_BONUS = "godmode";


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

function Pattern(connections) {
    this.connections = connections;

    this.top = connections['top'];
    this.right = connections['right'];
    this.bottom = connections['bottom'];
    this.left = connections['left'];
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