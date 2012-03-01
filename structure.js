// ===================================================== WORLD ===================================================== //
function World(blockSize, initialBlockLayers) {
  this.blockSize          = blockSize;
  this.initialBlockLayers = initialBlockLayers ? initialBlockLayers : 1;
}

World.prototype.initializeWorld = function() {
  var row, col;
  for (row = -initialBlockLayers; row <= initialBlockLayers; row++) {
    for (col = -initialBlockLayers; col <= initialBlockLayers; col++) {
      this.addBlock(row, col);
    }
  }
}

World.prototype.addBlock = function(row, col) {
  coord = new BlockCoordinate(row, col);
  block = new Block(this.blockSize);
  this.blocksp[coord] = block;

}

// ===================================================== BLOCK ===================================================== //
function Block(blockSize) {
  var row, col;
  this.cellsMatrix = new Array(blockSize);
  for (row = 0; row < blockSize; row++) {
    this.cellsMatrix[row] = new Array(blockSize);
    for (col = 0; col < blockSize; col++) {
      cell = new Cell();
      this.cellsMatrix[row][col] = cell;
    }
  }
}

// ===================================================== CELL ===================================================== //
function Cell(content, isWall) {
  this.content = content;
  this.isWall  = isWall;
}

// ===================================================== COORD ===================================================== //
function BlockCoordinate(row, col) {
  this.row = row;
  this.col = col;
}
