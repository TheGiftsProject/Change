/* ================================================= WORLD ================================================= */
function World(blockSize, initialBlockLayers) {
  this.blockSize          = blockSize;
  this.initialBlockLayers = initialBlockLayers;
  this.matrix = {};
  this.initializeWorld();
}

World.prototype.initializeWorld = function() {
  var block_row, block_col;
  for (block_row = -this.initialBlockLayers; block_row <= this.initialBlockLayers; block_row++)
    for (block_col = -this.initialBlockLayers; block_col <= this.initialBlockLayers; block_col++)
      this.addBlockForCell(block_row * this.blockSize, block_col * this.blockSize);
};

World.prototype.addBlock = function(block_row, block_col) {
  var block = new Block(this.blockSize);
  if (!this.matrix[block_row])
    this.matrix[block_row] = {};
  this.matrix[block_row][block_col] = block;
};

World.prototype.getCellAt = function(global_row, global_col) {
    if (!this.matrix[global_row] || !this.matrix[global_row][global_col])
        this.addBlockForCell(global_row, global_col);
    else return this.getCellAt(global_row, global_col);
};

World.prototype.addBlockForCell = function(global_row, global_col) {

}

/* ================================================= BLOCK ================================================= */
Block.prototype.generateEmptyMatrix = function() {
    var row, col;
    for (row = 0; row < this.blockSize; row++) {
        this.cellsMatrix[row] = new Array(this.blockSize);
        for (col = 0; col < this.blockSize; col++) {
            cell = new Cell(Cell.TYPES.WALL);
            this.cellsMatrix[row][col] = cell;
        }
    }
}

Block.prototype.generateMaze = function() {
    var SPACING = 7;
    var DEAD_END_CHANCE = 0;

    that = this;

    var randomDeadEndIndex = function(from, to) {
      if (Math.random() < DEAD_END_CHANCE)
        return Math.randomIntBetween(from+1, to); 
      return -1;
    };

    var digThroughCol = function (col, from_row, to_row) {
        random_dead_end = randomDeadEndIndex(from_row, to_row);
        for (var row = from_row; row < to_row; row++) 
          if (row != random_dead_end)
            that.getCellAt(row, col).setAsPath();
        return random_dead_end
    };

    var digThroughRow = function(row, from_col, to_col) {
        random_dead_end = randomDeadEndIndex(from_col, to_col);
        for (var col = from_col; col < to_col; col++)
          if (col != random_dead_end)
            that.getCellAt(row, col).setAsPath();
        return random_dead_end
    };

    var mazeRecursion = function(row_min, row_max, col_min, col_max, splitRow, exclude) {
        if (row_max - row_min < SPACING || col_max - col_min < SPACING) return
        else if (row_min == row_max || col_min == col_max) return

        var next_exclude;
        if (splitRow) {
            var random_row = Math.randomIntWithExclusion(row_min+1, row_max-1, exclude);
            next_exclude = digThroughRow(random_row, col_min, col_max);
            mazeRecursion(row_min, random_row, col_min, col_max, false, next_exclude);
            mazeRecursion(random_row + 1, row_max, col_min, col_max, false, next_exclude);
        }
        else {
            var random_col = Math.randomIntWithExclusion(col_min+1, col_max-1, exclude);
            next_exclude = digThroughCol(random_col, row_min, row_max);
            mazeRecursion(row_min, row_max, col_min, random_col, true, next_exclude);
            mazeRecursion(row_min, row_max, random_col + 1, col_max, true, next_exclude);
        }
    };
    mazeRecursion(0, this.blockSize, 0, this.blockSize, true, -1)
};

/* ================================================= CELL ================================================= */
function Cell(type) {
  this.type = type;
}

Cell.TYPES = {
    PATH: 0,
    WALL: 1
};

Cell.prototype.setAsPath = function() {
    this.type = Cell.TYPES.PATH;
};

Cell.prototype.isWall = function() {
    return this.type == Cell.TYPES.WALL;
};

Cell.prototype.isPath = function() {
    return this.type == Cell.TYPES.PATH;
};
