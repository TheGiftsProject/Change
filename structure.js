/* ================================================= WORLD ================================================= */
function World(blockSize, initialBlockLayers) {
  this.blockSize          = blockSize;
  this.initialBlockLayers = initialBlockLayers;
  this.blocks = {};
  this.initializeWorld();
}

World.prototype.initializeWorld = function() {
  var block_row, block_col;
  for (block_row = -this.initialBlockLayers; block_row <= this.initialBlockLayers; block_row++)
    for (block_col = -this.initialBlockLayers; block_col <= this.initialBlockLayers; block_col++)
      this.addBlock(block_row, block_col);
};

World.prototype.addBlock = function(block_row, block_col) {
  var neighnours = {
      top: this.getBlockAt(block_row - 1, block_col),
      right: this.getBlockAt(block_row, block_col +1),
      bottom: this.getBlockAt(block_row + 1, block_col),
      left: this.getBlockAt(block_row, block_col - 1)
  };
  var block = new Block(this.blockSize, neighnours);

  if (!this.blocks[block_row])
    this.blocks[block_row] = {};
  this.blocks[block_row][block_col] = block;
  block.connect();
};

World.prototype.getBlockAt= function(block_row, block_col) {
    if (!this.blocks[block_row]) {
        return null;
    }
    return this.blocks[block_row][block_col];
};

World.prototype.getCellAt = function(global_row, global_col) {
    var block_row = Math.floor(global_row / this.blockSize);
    var block_col = Math.floor(global_col / this.blockSize);
    var cell_row  = global_row.mod(this.blockSize);
    var cell_col  = global_col.mod(this.blockSize);
    if (!this.blocks[block_row] || !this.blocks[block_row][block_col])
        return new Cell(Cell.TYPES.WALL, null);
    else return this.blocks[block_row][block_col].getCellAt(cell_row, cell_col);
};

/* ================================================= BLOCK ================================================= */
function Block(blockSize, coord, neighbours) {
  this.neighbours = neighbours;
  this.blockSize = blockSize;
  this.cellsMatrix = new Array(blockSize)
  this.generateEmptyMatrix();
  this.generateMaze();
  this.setNeighboursForOthers();
}

Block.prototype.setNeighboursForOthers = function() {
    for (var side in this.neighbours) {
        if (this.getNeighbour(side)) {
            switch (side) {
                case "top": this.getNeighbour(side).neighbours["bottom"] = this; break;
                case "bottom": this.getNeighbour(side).neighbours["top"] = this; break;
                case "left": this.getNeighbour(side).neighbours["right"] = this; break;
                case "right": this.getNeighbour(side).neighbours["left"] = this; break;
            }
        }
    }
}

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

Block.prototype.getCellAt = function(row, col) {
    return this.cellsMatrix[row][col];
};

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

Block.prototype.connect = function() {
    for (var side in this.neighbours) {
        if (this.getNeighbour(side)) {
            switch (side) {
                case "top":
                    this.connectToTop(this.getNeighbour(side));
                    this.getNeighbour(side).connectToBottom(this);
                    break;
                case "bottom":
                    this.connectToBottom(this.getNeighbour(side));
                    this.getNeighbour(side).connectToTop(this);
                    break;
                case "left":
                    this.connectToLeft(this.getNeighbour(side));
                    this.getNeighbour(side).connectToRight(this);
                    break;
                case "right":
                    this.connectToRight(this.getNeighbour(side));
                    this.getNeighbour(side).connectToLeft(this);
                    break;
            }
        }
    }
};

Block.prototype.connectToTop = function(neighbour) {
    me = this;
    var isCellConnectedFromTop = function(row, col) {
        return me.getCellAt(row, col-1).isPath() || me.getCellAt(row, col+1).isPath() || me.getCellAt(row+1, col).isPath();
    };

    for (col = 1; col < this.blockSize-1; col++) {
        if (neighbour.getCellAt(this.blockSize-1, col).isPath()) {
            var climbing_row = 0;
            do {
                this.getCellAt(climbing_row, col).setAsPath();
                climbing_row++;
            } while (!isCellConnectedFromTop(climbing_row, col) && climbing_row < this.blockSize-2)
        }
    }
};

Block.prototype.connectToBottom = function(neighbour) {
    me = this;
    var isCellConnectedFromBottom = function(row, col) {
        return me.getCellAt(row, col-1).isPath() || me.getCellAt(row, col+1).isPath() || me.getCellAt(row-1, col).isPath();
    };

    for (col = 1; col < this.blockSize-1; col++) {
        if (neighbour.getCellAt(0, col).isPath()) {
            var climbing_row = this.blockSize-1;
            do {
                this.getCellAt(climbing_row, col).setAsPath();
                climbing_row--;
            } while (!isCellConnectedFromBottom(climbing_row, col) && climbing_row > 1)
        }
    }
};

Block.prototype.connectToLeft = function(neighbour) {
    me = this;
    var isCellConnectedFromLeft = function(row, col) {
        return me.getCellAt(row-1, col).isPath() || me.getCellAt(row+1, col).isPath() || me.getCellAt(row, col+1).isPath();
    };

    for (row = 1; row < this.blockSize-1; row++) {
        if (neighbour.getCellAt(row, this.blockSize-1).isPath()) {
            var climbing_col = 0;
            do {
                this.getCellAt(row, climbing_col).setAsPath();
                climbing_col++;
            } while (!isCellConnectedFromLeft(row, climbing_col) && climbing_col < this.blockSize-2)
        }
    }
};

Block.prototype.connectToRight = function(neighbour) {
    me = this;
    var isCellConnectedFromRight = function(row, col) {
        return me.getCellAt(row-1, col).isPath() || me.getCellAt(row+1, col).isPath() || me.getCellAt(row, col+1).isPath();
    };

    for (row = 1; row < this.blockSize-1; row++) {
        if (neighbour.getCellAt(row, 0).isPath()) {
            var climbing_col = this.blockSize-1;
            do {
                this.getCellAt(row, climbing_col).setAsPath();
                climbing_col--;
            } while (!isCellConnectedFromRight(row, climbing_col) && climbing_col > 1)
        }
    }
};

Block.prototype.getNeighbour = function(side) {
    return this.neighbours[side];
};

/* ================================================= CELL ================================================= */
function Cell(type, content) {
  this.type = type;
  this.content = content;
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
