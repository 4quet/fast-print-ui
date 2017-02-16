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

io.on('connection', function(socket){
  socket.on('disconnect', function() {
    console.log('user disconnected')
  })

  socket.on('print', function(data) {
    execa('lp', [ '-d', config.printer,
    '-o', 'media=' + config.format,
    '-n', '1', data])
    .then(res => {
      console.log('Printing', data.media, 'with', config.printer)
      console.log(res.stdout)
    }).catch(error => console.log(error.stderr))
  })
})

http.listen(config.port, function() {
  console.log('Fast Print UI: Listening on port', config.port)
  var watcher = chokidar.watch(config.mediaFolder)
  watcher
  .on('add', filepath => socket.emit('addItem', path.basename(filepath)))
  .on('unlink', filepath => socket.emit('deleteItem', path.basename(filepath)))
})
