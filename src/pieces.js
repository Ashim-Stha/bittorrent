"use strict";

module.exports = class {
  constructor(size) {
    // Initialize arrays to track requested and received pieces
    this.requested = new Array(size).fill(false);
    this.received = new Array(size).fill(false);
  }

  // Mark a piece as requested
  addRequested(pieceIndex) {
    this.requested[pieceIndex] = true;
  }

  // Mark a piece as received
  addReceived(pieceIndex) {
    this.received[pieceIndex] = true;
  }

  // Check if a piece is needed (not requested yet)
  needed(pieceIndex) {
    // If all pieces have been requested, reset the requested array to match the received array
    if (this.requested.every((i) => i === true)) {
      this.requested = this.received.slice();
    }
    return !this.requested[pieceIndex];
  }

  // Check if all pieces have been received
  isDone() {
    return this.received.every((i) => i === true);
  }
};
