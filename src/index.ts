import fs from "fs";
import bencode from "bencode";
import tracker from "./tracker";

const torrentData = fs.readFileSync("puppy.torrent");
const torrent = bencode.decode(torrentData, 0, torrentData.length, "utf8");

tracker.getPeers(torrent, (peers: any) => {
  console.log("list of peers: ", peers);
});
