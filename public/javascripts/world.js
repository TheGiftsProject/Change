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
        var sequence = Math.sequenceBuilder(4.5, 1.3, 0.1);

        _.each( sides, function(side){
            connections[side] = isSideConnected(side, sequence.pop());
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
