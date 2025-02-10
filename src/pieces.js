"use strict";

const tp = require("./torrent-parser");

module.exports = class {
  constructor(torrent) {
    // Helper function to build an array representing the pieces
    function buildPiecesArray() {
      // Calculate the number of pieces
      const nPieces = torrent.info.pieces.length / 20;
      // Create an array with nPieces elements, all initialized to null
      const arr = new Array(nPieces).fill(null);
      // Map each element to an array representing the blocks in that piece
      return arr.map((_, i) =>
        new Array(tp.blocksPerPiece(torrent, i)).fill(false)
      );
    }

    // Initialize the _requested and _received arrays using the helper function
    this._requested = buildPiecesArray();
    this._received = buildPiecesArray();
  }

  // Mark a block as requested
  addRequested(pieceBlock) {
    // Calculate the block index within the piece
    const blockIndex = pieceBlock.begin / tp.BLOCK_LEN;
    // Mark the block as requested
    this._requested[pieceBlock.index][blockIndex] = true;
  }

  // Mark a block as received
  addReceived(pieceBlock) {
    // Calculate the block index within the piece
    const blockIndex = pieceBlock.begin / tp.BLOCK_LEN;
    // Mark the block as received
    this._received[pieceBlock.index][blockIndex] = true;
  }

  // Check if a block is needed (not requested yet)
  needed(pieceBlock) {
    // If all blocks have been requested, reset the _requested array to match the _received array
    if (this._requested.every((blocks) => blocks.every((i) => i))) {
      this._requested = this._received.map((blocks) => blocks.slice());
    }
    // Calculate the block index within the piece
    const blockIndex = pieceBlock.begin / tp.BLOCK_LEN;
    // Return true if the block has not been requested yet
    return !this._requested[pieceBlock.index][blockIndex];
  }

  // Check if all pieces have been received
  isDone() {
    // Return true if all blocks in all pieces have been received
    return this._received.every((blocks) => blocks.every((i) => i));
  }

  printPercentDone() {
    const downloaded = this._received.reduce((totalBlocks, blocks) => {
      return blocks.filter((i) => i).length + totalBlocks;
    }, 0);

    const total = this._received.reduce((totalBlocks, blocks) => {
      return blocks.length + totalBlocks;
    }, 0);

    const percent = Math.floor((downloaded / total) * 100);

    process.stdout.write("progress: " + percent + "%\r");
  }
};
// module.exports = class {
//   constructor(size) {
//     // Initialize arrays to track requested and received pieces
//     this.requested = new Array(size).fill(false);
//     this.received = new Array(size).fill(false);
//   }

//   // Mark a piece as requested
//   addRequested(pieceIndex) {
//     this.requested[pieceIndex] = true;
//   }

//   // Mark a piece as received
//   addReceived(pieceIndex) {
//     this.received[pieceIndex] = true;
//   }

//   // Check if a piece is needed (not requested yet)
//   needed(pieceIndex) {
//     // If all pieces have been requested, reset the requested array to match the received array
//     if (this.requested.every((i) => i === true)) {
//       this.requested = this.received.slice();
//     }
//     return !this.requested[pieceIndex];
//   }

//   // Check if all pieces have been received
//   isDone() {
//     return this.received.every((i) => i === true);
//   }
// };
