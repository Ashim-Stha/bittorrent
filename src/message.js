"use strict";

const Buffer = require("buffer").Buffer;
const torrentParser = require("./torrent-parser");
const util = require("./util");

module.exports.buildHandshake = (torrent) => {
  const buf = Buffer.alloc(68);

  //pstrlen
  buf.writeUint8(19, 0);

  //pstr
  buf.writeBigInt32BE("BitTorrent protocol", 1);

  //reserved
  buf.writeBigInt32BE(0, 20);
  buf.writeBigInt32BE(0, 24);

  //info hash
  torrentParser.infoHash(torrent).copy(buf, 28);

  //peer id
  buf.write(util.genId());
  return buf;
};

module.exports.buildKeepAlive = () => Buffer.alloc(4);
