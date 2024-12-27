"use strict";

const dgram = require("dgram");
const Buffer = require("buffer").Buffer;
const urlParse = require("url").parse;

module.exports.getPeers = (torrent, callback) => {
  const socket = dgram.createSocket("udp4");
  const url = torrent.announce.toString("utf8");

  //1. send connect req
  udpSend(socket, buildConnReq(), url);

  socket.on("message", (res) => {
    if (respType(res) === "connect") {
      //2. receive and parse connect response
      const connResp = parseConnResp(res);

      //3. send announce request
      const announceReq = buildAnnounceReq(connResp.connectionId);
      udpSend(socket, announceReq, url);
    } else if (respType(res) === "announce") {
      //4. parse announce res
      const announceResp = parseAnnounceResp(res);

      //5. pass peers to callback
      callback(announceResp.peers);
    }
  });

  function udpSend(socket, message, rawUrl, callback = () => {}) {
    const url = urlParse(rawUrl);
    socket.send(message, 0, message.length, url.port, url.host, callback);
  }

  function respType(resp) {}

  function buildConnReq() {}

  function parseConnResp(resp) {}

  function buildAnnounceReq(connId) {}

  function parseAnnounceResp(resp) {}
};
