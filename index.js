const express = require("express")
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
const fs = require('fs')
const execa = require('execa')
const chokidar = require('chokidar')

const config = require('./config/config')

app.use('/media', express.static(config.mediaFolder))

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'))
})

http.listen(config.port, function() {
  console.log('Fast Print UI: Listening on port', config.port)
})

io.on('connection', function(socket){

  var watcher = chokidar.watch(config.mediaFolder)
  watcher
  .on('add', filepath => socket.emit('addItem', path.basename(filepath)))
  .on('unlink', filepath => socket.emit('deleteItem', path.basename(filepath)))

  socket.on('print', function(data) {
    var file = path.join(config.mediaFolder, path.basename(data.media))
    execa('lp', [ '-d', config.printer,
    '-o', 'media=' + config.format,
    '-n', '1', file])
    .then(res => {
      console.log('Printing', data.media, 'with', config.printer)
      console.log(res.stdout)
    }).catch(error => console.log(error.stderr))
  })
})
