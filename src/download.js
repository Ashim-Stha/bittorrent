"use strict";

const net = require("net");
const tracker = require("./tracker");
const message = require("./message");

//1
const Pieces = require("./pieces");

module.exports = (torrent) => {
  // const requested = [];
  tracker.getPeers(torrent, (peers) => {
    //1
    const pieces = new Pieces(torrent.info.pieces.length / 20);
    peers.forEach((peer) => download(peer, torrent, pieces));
  });
};

//1
function download(peer, torrent, pieces) {
  const socket = new net.Socket();
  socket.on("error", console.log);
  socket.connect(peer.port, peer.ip, () => {
    socket.write(message.buildHandshake(torrent));
  });

  //1
  const queue = { choked: true, queue: [] };
  onWholeMsg(socket, (msg) => {
    msgHandler(msg, socket, pieces, queue);
  });
  // socket.on("data", (data) => {});
}

function onWholeMsg(socket, callback) {
  let savedBuf = Buffer.alloc(0);
  let handshake = true;

  socket.on("data", (recvBuf) => {
    const msglen = () =>
      handshake ? savedBuf.readUInt8(0) + 49 : savedBuf.readInt32BE(0) + 4;

    while (savedBuf.length >= 4 && savedBuf.length >= msglen()) {
      callback(savedBuf.slice(0, msglen())); // Invoking the callback with the complete message
      savedBuf = savedBuf.slice(msglen());
      handshake = false;
    }
  });
}

//1
function msgHandler(msg, socket, pieces, queue) {
  if (isHandshake(msg)) {
    socket.write(message.buildInterested());
  } else {
    const m = message.parse(msg);

    if (m.id === 0) chokeHandler(socket);

    //1
    if (m.id === 1) unchokeHandler(socket, pieces, queue);
    if (m.id === 4) haveHandler(m.payload);
    if (m.id === 5) bitfieldHandler(m.payload);
    if (m.id === 7) pieceHandler(m.payload);
  }
}

function isHandshake(msg) {
  return (
    msg.length === msg.readUInt8(0) + 49 &&
    msg.toString("utf8", 1) === "BitTorrent protocol"
  );
}

function chokeHandler(socket) {
  socket.end();
}

//1
function unchokeHandler(socket, pieces, queue) {
  queue.choked = false;
  //2
  requestPiece(socket, pieces, queue);
}

function haveHandler() {
  // const pieceIndex = payload.readInt32BE(0);
  // queue.push(pieceIndex);
  // if (queue.length === 1) {
  //   requestPiece(socket, requested, queue);
  // }
  // if (!requested[pieceIndex]) {
  //   socket.write(message.buildRequest());
  // }
  // requested[pieceIndex] = true;
}

function bitfieldHandler() {}

function pieceHandler() {
  // queue.shift();
  // requestPiece(socket, requested, queue);
}

function requestPiece(socket, pieces, queue) {
  //2
  if (queue.choked) return null;

  while (queue.queue.length) {
    const pieceIndex = queue.shift();
    if (pieces.needed(pieceIndex)) {
      socket.write(message.buildRequest(pieceIndex));
      pieces.addRequested(pieceIndex);
      break;
    }
  }
  // if (requested[queue[0]]) {
  //   queue.shift();
  // } else {
  //   socket.write(message.buildRequest(pieceIndex));
  // }
}
