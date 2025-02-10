"use strict";

const Buffer = require("buffer").Buffer;
const torrentParser = require("./torrent-parser");
const util = require("./util");

module.exports.buildHandshake = (torrent) => {
  const buf = Buffer.alloc(68);

  //pstrlen
  buf.writeUint8(19, 0);

  //pstr
  buf.write("BitTorrent protocol", 1);

  //reserved
  buf.writeUInt32BE(0, 20);
  buf.writeUInt32BE(0, 24);

  //info hash
  torrentParser.infoHash(torrent).copy(buf, 28);

  //peer id
  util.genId().copy(buf, 48);
  return buf;
};

module.exports.buildKeepAlive = () => Buffer.alloc(4);

module.exports.buildChoke = () => {
  const buf = Buffer.alloc(5);

  //length
  buf.writeUInt32BE(1, 0);

  //id
  buf.writeUInt8(0, 4);
  return buf;
};

module.exports.buildUnchoke = () => {
  const buf = Buffer.alloc(5);

  //length
  buf.writeUInt32BE(1, 0);

  //id
  buf.writeUInt8(1, 4);
  return buf;
};

module.exports.buildInterested = () => {
  const buf = Buffer.alloc(5);

  //length
  buf.writeUInt32BE(1, 0);

  //id
  buf.writeUInt8(2, 4);
  return buf;
};

module.exports.buildUninterested = () => {
  const buf = Buffer.alloc(5);

  //length
  buf.writeUInt32BE(1, 0);

  //id
  buf.writeUInt8(3, 4);
  return buf;
};

module.exports.buildHave = (payload) => {
  const buf = Buffer.alloc(9);

  //length
  buf.writeUInt32BE(5, 0);

  //id
  buf.writeUInt8(4, 4);

  //piece index
  buf.writeUInt32BE(payload, 5);
  return buf;
};

module.exports.buildBitfield = (bitfield) => {
  const buf = Buffer.alloc(14);

  //length
  buf.writeUInt32BE(payload.length + 1, 0);

  //id
  buf.writeUInt8(5, 4);

  //bitfield
  bitfield.copy(buf, 5);
  return buf;
};

module.exports.buildRequest = (payload) => {
  const buf = Buffer.alloc(17);

  //length
  buf.writeUInt32BE(13, 0);

  //id
  buf.writeUInt8(6, 4);

  //piece index
  buf.writeUInt32BE(payload.index, 5);

  //begin
  buf.writeUInt32BE(payload.begin, 9);

  //length
  buf.writeUInt32BE(payload.length, 13);
  return buf;
};

module.exports.buildPiece = (payload) => {
  const buf = Buffer.alloc(payload.block.length + 13);

  //length
  buf.writeUInt32BE(payload.block.length + 9, 0);

  //id
  buf.writeUInt8(7, 4);

  //piece index
  buf.writeUInt32BE(payload.index, 5);

  //begin
  buf.writeUInt32BE(payload.begin, 9);

  //block
  payload.block.copy(buf, 13);
  return buf;
};

module.exports.buildCancel = (payload) => {
  const buf = Buffer.alloc(17);

  //length
  buf.writeUInt32BE(13, 0);

  //id
  buf.writeUInt8(8, 4);

  //piece index
  buf.writeUInt32BE(payload.index, 5);

  //begin
  buf.writeUInt32BE(payload.begin, 9);

  //length
  buf.writeUInt32BE(payload.length, 13);
  return buf;
};

module.exports.buildPort = (payload) => {
  const buf = Buffer.alloc(7);

  //length
  buf.writeUInt32BE(3, 0);

  //id
  buf.writeUInt8(9, 4);

  //listen-port
  buf.writeUInt16BE(payload, 5);
  return buf;
};

module.exports.parse = (msg) => {
  // Extract the message ID if the message length is greater than 4 bytes
  const id = msg.length > 4 ? msg.readInt8(4) : null;

  // Extract the payload if the message length is greater than 5 bytes
  let payload = msg.length > 5 ? msg.slice(5) : null;

  // If the message ID is 6 (request), 7 (piece), or 8 (cancel), further parse the payload
  if (id === 6 || id === 7 || id === 8) {
    const rest = payload.slice(8); // Extract the remaining part of the payload after the first 8 bytes
    payload = {
      index: payload.readInt32BE(0), // Read the piece index from the first 4 bytes of the payload
      begin: payload.readInt32BE(4), // Read the begin offset from the next 4 bytes of the payload
    };
    payload[id === 7 ? "block" : "length"] = rest; // Assign the rest of the payload to 'block' if ID is 7, otherwise to 'length'
  }

  // Return an object containing the message size, ID, and parsed payload
  return {
    size: msg.readInt32BE(0), // Read the message size from the first 4 bytes
    id, // The message ID
    payload, // The parsed payload
  };
};
