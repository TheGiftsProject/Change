class World
  constructor: (@numberOfCells, @initialBlockLayers = 1) ->
    @blocks = {}
    @initializeWorld()

  initializeWorld: ->
    for row in [-@initialBlockLayers..@initialBlockLayers]
      for col in [-@initialBlockLayers..@initialBlockLayers]
        @addBlock(row, col)

  addBlock: (row, col) ->
    coord = new BlockCoordinate(row, col)
    block = new Block(@numberOfCells, coord)
    @blocks[coord] = block

class Block
  constructor: (@numberOfCells, isRandome = true) ->
    @cellsGrid = new Array(numberOfCells)
    for row in [0...numberOfCells]
      @cellsGrid[row] = new Array(numberOfCells)
      for col in [0...numberOfCells]
        cell = new Cell()
        cell.randomize() if isRandome is on
        @cellsGrid[row][col] = cell


  randomize: ->
    for row in @numberOfCells
      for col in @numberOfCells
        @cellsGrid[row][col].randomize()


class Cell
  constructor: (@content = null, @isWall = false) ->

  randomize: ->
    @isWall = Math.random() > 0.5


class BlockCoordinate
  constructor: (@row, @col) ->

