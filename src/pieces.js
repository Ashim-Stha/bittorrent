"use strict";

const tp = require("./torrent-parser");

module.exports = class {
  constructor(torrent) {
    function buildPiecesArray() {
      const nPieces = torrent.info.pieces.length / 20;
      const arr = new Array(nPieces).fill(null);
      return arr.map((_, i) =>
        new Array(tp.blocksPerPiece(torrent, i)).fill(false)
      );
    }

    this._requested = buildPiecesArray();
    this._received = buildPiecesArray();
  }

  addRequested(pieceBlock) {
    const blockIndex = pieceBlock.begin / tp.BLOCK_LEN;
    this._requested[pieceBlock.index][blockIndex] = true;
  }

  addReceived(pieceBlock) {
    const blockIndex = pieceBlock.begin / tp.BLOCK_LEN;
    this._received[pieceBlock.index][blockIndex] = true;
  }

  needed(pieceBlock) {
    if (this._requested.every((blocks) => blocks.every((i) => i))) {
      this._requested = this._received.map((blocks) => blocks.slice());
    }
    const blockIndex = pieceBlock.begin / tp.BLOCK_LEN;
    return !this._requested[pieceBlock.index][blockIndex];
  }

  isDone() {
    return this._received.every((blocks) => blocks.every((i) => i));
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
