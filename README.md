#BitTorrent Client

This is a simple BitTorrent client implemented in Node.js. It demonstrates the basic functionality of downloading files using the BitTorrent protocol.

## Features

- Connect to a tracker to get peers
- Download pieces from peers
- Handle BitTorrent protocol messages

## Project Structure

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

- `index.js`: Entry point of the application. It parses the torrent file and starts the download process.
- `download.js`: Manages the download process by connecting to peers and requesting pieces.
- `message.js`: Constructs and parses BitTorrent protocol messages.
- `pieces.js`: Keeps track of the pieces that have been requested and received.
- `torrent-parser.js`: Parses the torrent file and extracts necessary information.
- `tracker.js`: Connects to the tracker to get a list of peers.
- `util.js`: Utility functions, including generating a unique peer ID.

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
   node index.js puppy.torrent
   ```

## Dependencies

- `bencode`: For decoding and encoding bencoded data.
- `crypto`: For generating random bytes and hashing.
- `dgram`: For UDP communication.
- `net`: For TCP communication.

## License

This project is licensed under the ISC License.

