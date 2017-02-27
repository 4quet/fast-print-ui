'use strict'

const express = require('express')
const app = express()
const http = require('http').Server(app)
const path = require('path')
const execa = require('execa')
const chokidar = require('chokidar')
const spacebroClient = require('./spacebro-client')

const config = require('./config/config')

app.use('/media', express.static(config.mediaFolder))
app.use('/spacebro-client', express.static('spacebro-client'))

spacebroClient.connect('127.0.0.1', 8888, {
  clientName: 'fast-print-ui-back',
  channelName: 'fast-print',
  verbose: false
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

http.listen(config.port, function () {
  console.log('Fast Print UI: Listening on port', config.port)
  spacebroClient.on('ready', function () {
    var watcher = chokidar.watch(config.mediaFolder)
    watcher
    .on('add', filepath => spacebroClient.emit('add-item', path.basename(filepath)))
    .on('unlink', filepath => spacebroClient.emit('delete-item', path.basename(filepath)))

    spacebroClient.on('print', function (data) {
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
})
