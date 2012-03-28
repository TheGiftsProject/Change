/* ================================================= WORLD ================================================= */
function World() {
    this.patternsMatrix = {};
    this.cells = {};
    this.entities = [];
    this.hobo = new Hobo(Hobo.START.x, Hobo.START.y, this);
    this.addEntity(this.hobo);

    this.nextDogCreationTag = this.generateNextDogCreationTag();
    this.dogCreationCounter = 0;
};

World.DOG_CREATION_RANGE_MIN = 20;
World.DOG_CREATION_RANGE_MAX = 25;

World.prototype.addEntity = function(entity) {
    this.entities.push(entity);
}

World.prototype.removeEntity = function(entity) {
    this.entities.splice(this.entities.indexOf(entity), 1);
}

World.prototype.generateNextDogCreationTag = function() {
    return Math.floor(Math.randomRange(World.DOG_CREATION_RANGE_MIN, World.DOG_CREATION_RANGE_MAX));
}

World.prototype.checkDogCreationAt = function(pattern_coord)
{
    this.dogCreationCounter++;
    if (this.dogCreationCounter == this.nextDogCreationTag) {
        this.dogCreationCounter = 0;
        this.nextDogCreationTag = this.generateNextDogCreationTag();
        var levelCoords = pattern_coord.toLevelCoords();
        this.addEntity(new Dog(levelCoords.row, levelCoords.col, this, this.hobo));
        console.log(levelCoords);
    }
}

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
        pattern = this.generatePatternFor(pattern_coord);
        this.checkDogCreationAt(pattern_coord);

        for (var internal_row = 0; internal_row < 3; internal_row++) {
            for (var internal_col = 0; internal_col < 3; internal_col++) {
                this.addCellAt(pattern.internalCellAt(internal_row, internal_col), pattern_coord.row * 3 + internal_row, pattern_coord.col * 3 + internal_col);
            }
        }
    }
    return this.cells[global_row][global_col];
};

World.VARIANCE_CHANCE = 2;
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

    var top_function = function() {
        if (!top_exists || top_connected) {
            top_connected = top_connected || Math.roll(connection_chances[new_connections]);
            new_connections++;
        }
    }

    var right_function = function() {
        if (!right_exists || right_connected) {
            right_connected = right_connected || Math.roll(connection_chances[new_connections]);
            new_connections++;
        }
    }

    var bottom_function = function() {
        if (!bottom_exists | bottom_connected) {
            bottom_connected = bottom_connected || Math.roll(connection_chances[new_connections]);
            new_connections++;
        }
    }

    var left_function = function() {
        if (!left_exists || left_connected) {
            left_connected = left_connected || Math.roll(connection_chances[new_connections]);
            new_connections++;
        }
    }

    var connection_functions = [top_function, right_function, bottom_function, left_function].shuffle();
    for (var i = 0; i < 4; i++) {
        connection_functions[i].call();
    }

    var pattern = new Pattern({top:top_connected, right:right_connected, bottom:bottom_connected, left:left_connected});

    if (!this.patternsMatrix[coord.row]) {
        this.patternsMatrix[coord.row] = {};
    }

    this.patternsMatrix[coord.row][coord.col] = pattern;
    return pattern;
};
