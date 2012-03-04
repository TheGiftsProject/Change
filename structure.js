function World(blockSize, initialBlockLayers) {
  this.blockSize          = blockSize;
  this.initialBlockLayers = initialBlockLayers != undefined ? initialBlockLayers : 1;
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

World.prototype.getBlock = function(row, col) {
    if (!this.blocks[row]) {
        return null;
    }
    else return this.blocks[row][col];
}

function Block(blockSize, coord) {
  this.coord = coord;
  this.blockSize = blockSize;
  this.generateEmptyMatrix();
}

Block.prototype.generateEmptyMatrix = function() {
    var row, col;
    this.cellsMatrix = new Array(this.blockSize);
    for (row = 0; row < this.blockSize; row++) {
        this.cellsMatrix[row] = new Array(this.blockSize);
        for (col = 0; col < this.blockSize; col++) {
            cell = new Cell(false, Math.random() > 0.5 ? Cell.TYPES.WALL : Cell.TYPES.CLEAR);
            this.cellsMatrix[row][col] = cell;
        }
    }
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

function Cell(content, type) {
  this.content = content != undefined ? content : false;
  this.type = type != undefined ? type : Cell.WALL;
}

Cell.TYPES = {
    WALL: 0,
    CLEAR: 1
}

Cell.prototype.toString = function() {
    return this.type;
}


function BlockCoordinate(row, col) {
  this.row = row;
  this.col = col;
}
