"use strict";

const net = require("net");
const Buffer = require("buffer").Buffer;
const tracker = require("./tracker");
const message = require("./message");

module.exports = (torrent) => {
  const requested = [];
  tracker.getPeers(torrent, (peers) => {
    peers.forEach((peer) => download(peer, torrent, requested));
  });
};

function download(peer, torrent) {
  const socket = new net.Socket();
  socket.on("error", console.log);
  socket.connect(peer.port, peer.ip, () => {
    //1
    socket.write(message.buildHandshake(torrent));
  });

  //2
  onWholeMsg(socket, (msg) => {
    msgHandler(msg, socket, requested);
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

//2
function msgHandler(msg, socket, requested) {
  if (isHandshake(msg)) {
    socket.write(message.buildInterested());
  } else {
    const m = message.parse(msg);

    if (m.id === 0) chokeHandler();
    if (m.id === 1) unchokeHandler();
    if (m.id === 4) haveHandler(m.payload, socket, requested);
    if (m.id === 5) bitfieldHandler(m.payload);
    if (m.id === 7) pieceHandler(m.payload);
  }
}

//3
function isHandshake(msg) {
  return (
    msg.length === msg.readUInt8(0) + 49 &&
    msg.toString("utf8", 1) === "BitTorrent protocol"
  );
}

function chokeHandler() {}
function unchokeHandler() {}
function haveHandler(payload, socket, requested) {
  const pieceIndex = payload.readInt32BE(0);
  if (!requested[pieceIndex]) {
    socket.write(message.buildRequest());
  }

  requested[pieceIndex] = true;
}
function bitfieldHandler(payload) {}
function pieceHandler(payload) {}
