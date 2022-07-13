// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  // const m = 8;
  // const n = 8;
  let bigArr = new Array(8);
  for (let i = 0; i < 8; i++) {
    bigArr[i] = new Array(8);
  }
  bigArr[4][3] = new Piece('black');
  bigArr[3][4] = new Piece('black');
  bigArr[3][3] = new Piece('white');
  bigArr[4][4] = new Piece('white');

  return bigArr;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  col = pos[0];
  row = pos[1];
  if ((col >= 0 && col < 8) && (row >= 0 && row < 8) ) {
    return true;
  } else {
    return false;
  }
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (this.isValidPos(pos) ) {
    return this.grid[pos[0]][pos[1]];
  } else {
    throw new Error('Not valid pos!');
  }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if (this.grid[pos[0]][pos[1]] && this.getPiece(pos).color === color) {
    return true;
  } 
  return false;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  if (this.grid[pos[0]][pos[1]]) {
    return true;
  }
  return false;
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip=[]){
  // pos is the end square where you are placing the piece
  // dir is a pair 
  // define a new square first
  // call the function again on thatsquare until a base case
  // return an array of all the squares we want to flip
  newPos = [pos[0] + dir[0], pos[1] + dir[1]];
  if (this.isValidPos(newPos) === false) {
    return [];
  } else if (!this.grid[newPos[0]][newPos[1]]) {
    return [];
  } else if (this.isMine(newPos, color)) {
    return piecesToFlip;
  } else {
    piecesToFlip.push(newPos);
    return this._positionsToFlip(newPos, color, dir, piecesToFlip);
  }
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) {
    return false;
  } 
  for (let i = 0; i < Board.DIRS.length; i++){
    let moves = this._positionsToFlip(pos, color, Board.DIRS[i], piecesToFlip = []);
    if (moves.length !== 0) {
      return true;
    }
  }
  return false;
};

// Board.prototype.collectPieces = function (pos, color) {
//   let array = [];
//   for (let i = 0; i < Board.DIRS.length; i++) {
//     let moves = this._positionsToFlip(pos, color, Board.DIRS[i], piecesToFlip = []);
//     array.concat(moves);
//   }
//   return array;
// };


/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (this.validMove(pos, color)) {
    this.grid[pos[0]][pos[1]] = new Piece(color);

    let collect = [];
    for (let i = 0; i < Board.DIRS.length; i++) {
      let moves = this._positionsToFlip(pos, color, Board.DIRS[i], piecesToFlip = []);
      collect = collect.concat(moves);
    }
    for (let i = 0; i < collect.length; i++) {
      this.getPiece(collect[i]).flip();
    }
    
  } else {
    throw new Error("Invalid move!");
  }
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let array = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (this.validMove([i, j], color) === true) {
        array.push([i, j]);
      }
    }
  }
  return array;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  if (this.validMoves(color).length === 0) {
    return false;
  } else {
    return true;
  }
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  if (this.hasMove('white') === false &&  this.hasMove('black') === false) {
    return true;
  } else {
    return false;
  }
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE



console.log(_makeGrid ());