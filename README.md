
# BitTorrent Client

This is a fully functional BitTorrent client implemented in Node.js. It demonstrates the basic functionality of downloading files using the BitTorrent protocol.

## Features

- Connect to a tracker to get peers
- Download pieces from peers
- Handle BitTorrent protocol messages
- Support for multiple peers
- Progress tracking and completion notification
- firt comment
- second comment
- third
- hello
- without edititing

## Project Structuredifrriufhruifghrui

```
.gitignore
index.js
package.json
puppy.torrent
src/
	download.js
	message.js
	pieces.js
	torrent-parser.js
	tracker.js
	util.js
```

- [`.gitignore`](.gitignore): Specifies files and directories to be ignored by Git.
- [`index.js`](index.js): Entry point of the application. It parses the torrent file and starts the download process.
- [`package.json`](package.json): Contains metadata about the project and its dependencies.
- [`puppy.torrent`](puppy.torrent): Example torrent file.
- [`src/download.js`](src/download.js): Manages the download process by connecting to peers and requesting pieces.
- [`src/message.js`](src/message.js): Constructs and parses BitTorrent protocol messages.
- [`src/pieces.js`](src/pieces.js): Keeps track of the pieces that have been requested and received.
- [`src/torrent-parser.js`](src/torrent-parser.js): Parses the torrent file and extracts necessary information.
- [`src/tracker.js`](src/tracker.js): Connects to the tracker to get a list of peers.
- [`src/util.js`](src/util.js): Utility functions, including generating a unique peer ID.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/bittorrent.git
   cd bittorrent
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Usage

1. Place your `.torrent` file in the project directory. For example, puppy.torrent.

2. Run the client:
   ```sh
   nodemon .\index.js path/to/your/torrent/file.torrent
   ```

## Testing on Multiple Computers

To fully test the BitTorrent client, it is beneficial to run it on multiple computers:

1. Ensure each computer has Node.js and npm installed.
2. Clone the repository on each computer.
3. Use the same `.torrent` file on all computers.
4. Run the client on each computer:
   ```sh
   nodemon .\index.js path/to/your/torrent/file.torrent
   ```
5. Monitor the console output for progress and completion messages.
6. Verify the integrity of the downloaded file on each computer.

## Dependencies

- [`bencode`](https://www.npmjs.com/package/bencode): For decoding and encoding bencoded data.
- `crypto`: For generating random bytes and hashing.
- `dgram`: For UDP communication.
- `net`: For TCP communication.
- [`big-integer`](https://www.npmjs.com/package/big-integer): For handling large integers.

## License

This project is licensed under the ISC License.
