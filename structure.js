/* ================================================= WORLD ================================================= */
function World(blockSize, initialBlockLayers) {
  this.blockSize          = blockSize;
  this.initialBlockLayers = initialBlockLayers;
  this.blocks = {};
  this.initializeWorld();
}

World.prototype.initializeWorld = function() {
  var row, col;
  for (row = -this.initialBlockLayers; row <= this.initialBlockLayers; row++) {
    for (col = -this.initialBlockLayers; col <= this.initialBlockLayers; col++) {
      this.addBlock(row, col);
    }
  }
}

World.prototype.addBlock = function(row, col) {
  var coord = new BlockCoordinate(row, col);
  var block = new Block(this.blockSize, coord);
  if (!this.blocks[row]) {
    this.blocks[row] = {};
  }
  this.blocks[row][col] = block;
}

World.prototype.getBlockAt = function(row, col) {
    if (!this.blocks[row]) {
        return null;
    }
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
    matrix = this.cellsMatrix;

    var digThroughCol = function (col, fromRow, toRow) {
        for (var row = fromRow; row < toRow; row++) {
            this.matrix[row][col].type = Cell.TYPES.CLEAR;
        }
    }

    var digThroughRow = function(row, fromCol, toCol) {
        for (var col = fromCol; col < toCol; col++) {
            this.matrix[row][col].type = Cell.TYPES.CLEAR;
        }
    }

    var mazeRecursion = function(row_min, row_max, col_min, col_max) {
        // end conditions.
        if (row_max - row_min < 3 || col_max - col_min < 3) return
        else if (row_min == row_max || col_min == col_max) return

        // choose to split by col/row randomly.
        if (Math.random() > 0.5) {
            var random_row = Math.randomIntBetween(row_min, row_max);
            digThroughRow(random_row, col_min, col_max);
            mazeRecursion(row_min, random_row - 1, col_min, col_max);
            mazeRecursion(random_row + 1, row_max, col_min, col_max);
        }
        else {
            var random_col = Math.randomIntBetween(col_min, col_max);
            digThroughCol(random_col, row_min, row_max);
            mazeRecursion(row_min, row_max, col_min, random_col - 1);
            mazeRecursion(row_min, row_max, random_col + 1, col_max);
        }
    }

    mazeRecursion(0, this.blockSize, 0, this.blockSize)
}

Block.prototype.toString = function() {
    var row, col;
    var string = "";
    for (row = 0; row < this.blockSize; row++) {
        for (col = 0; col < this.blockSize; col++) {
            string += this.cellsMatrix[row][col].toString();
        }
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
