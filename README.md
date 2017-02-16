# fast-print-ui

**fast-print-ui** is an interface to quickly print images contained in a chosen directory. It only works on Linux and OS X.

## Installation

`git clone https://github.com/4quet/fast-print-ui.git`
`cd fast-print-ui`
`cp config/config.example.json config/config.json`

In `config.json`:

`mediaFolder` is the directory to be watched.
Add images to this directory to add them to the interface.

`printer` is the printer to be used.
List available printers with the `lpstat -v` command.

`format` is the format to be used by the printer.
List available formats for a given printer with the `lpoptions -p <your-printer> -l` command.

`port` is the port to be used for launching the application. Default is `8085`.

`npm install`
`npm start`

## Usage

Go to [http://localhost:8085/](http://localhost:8085/) (or whatever port you want to use)

Add / delete images to the directory you are watching.

Click them, print them.

## Dependencies

[express](https://github.com/expressjs/express)
[socket.io](https://github.com/socketio/socket.io)
[execa](https://github.com/sindresorhus/execa)
[chokidar](https://github.com/paulmillr/chokidar)
