/* ================================================= WORLD ================================================= */
function World(blockSize, initialBlockLayers) {
  this.blockSize          = blockSize;
  this.initialBlockLayers = initialBlockLayers;
  this.blocks = {};
  this.initializeWorld();
}

World.prototype.initializeWorld = function() {
  var row, col;
  for (row = -this.initialBlockLayers; row <= this.initialBlockLayers; row++)
    for (col = -this.initialBlockLayers; col <= this.initialBlockLayers; col++)
      this.addBlock(row, col);
}

World.prototype.addBlock = function(row, col) {
  var coord = new BlockCoordinate(row, col);
  var block = new Block(this.blockSize, coord);
  if (!this.blocks[row])
    this.blocks[row] = {};
  this.blocks[row][col] = block;
}

World.prototype.getBlockAt = function(row, col) {
    if (!this.blocks[row]) 
        return null;
    else return this.blocks[row][col];
}

/* ================================================= BLOCK ================================================= */
function Block(blockSize, coord) {
  this.coord = coord;
  this.blockSize = blockSize;
  this.generateEmptyMatrix();
  this.generateMaze();
}

Block.prototype.generateEmptyMatrix = function() {
    var row, col;
    this.cellsMatrix = new Array(this.blockSize);
    for (row = 0; row < this.blockSize; row++) {
        this.cellsMatrix[row] = new Array(this.blockSize);
        for (col = 0; col < this.blockSize; col++) {
            cell = new Cell(Cell.TYPES.WALL);
            this.cellsMatrix[row][col] = cell;
        }
    }
}

Block.prototype.generateMaze = function() {
    var SPACING = 4;
    var DEAD_END_CHANCE = 0.1;

    matrix = this.cellsMatrix;

    var randomDeadEndIndex = function(from, to) {
      if (Math.random() < DEAD_END_CHANCE)
        return Math.randomIntBetween(from+1, to); 
      return -1;
    }

    var digThroughCol = function (col, from_row, to_row) {
        random_dead_end = randomDeadEndIndex(from_row, to_row);
        for (var row = from_row; row < to_row; row++) 
          if (row != random_dead_end)
              this.matrix[row][col].type = Cell.TYPES.CLEAR;
        return random_dead_end
    }

    var digThroughRow = function(row, from_col, to_col) {
        random_dead_end = randomDeadEndIndex(from_col, to_col);
        for (var col = from_col; col < to_col; col++)
          if (col != random_dead_end)
            this.matrix[row][col].type = Cell.TYPES.CLEAR;
        return random_dead_end
    }

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
    }
    mazeRecursion(0, this.blockSize, 0, this.blockSize, true, -1)
}

Block.prototype.toString = function() {
    var row, col;
    var string = "";
    for (row = 0; row < this.blockSize; row++) {
        for (col = 0; col < this.blockSize; col++) 
            string += this.cellsMatrix[row][col].toString();
        string += '\n';
    }
    return string;
}

/* ================================================= CELL ================================================= */
function Cell(type, content) {
  this.type = type;
  this.content = content;
}

Cell.TYPES = {
    CLEAR: 0,
    WALL: 1
}

Cell.prototype.toString = function() {
    return this.type;
}

/* ================================================= COORDS ================================================= */
function BlockCoordinate(row, col) {
  this.row = row;
  this.col = col;
}
