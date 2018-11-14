
/* 
  Used for serving static build file to do async js library loading and testing,
  Can also respond to click, search and conversion events with random id's
*/
const express = require('express')
      testServer = express(),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      fs = require('fs'),
      crypto = require('crypto'),
      path = require('path');

const dataFile = './tests/data.txt'
const timeout = 1000;

testServer.use(cors())
testServer.use(bodyParser.json())
testServer.use(bodyParser.text())
testServer.use(express.static(path.join(__dirname, './../dist')))
testServer.use(express.static(path.join(__dirname, './../tests/production')))

testServer.post('/1/search', function (req, res) {
  fs.appendFile(dataFile, req.body + "\n")
  res.send({
    queryID: 1234567890
  })
})

testServer.post('/1/click', function (req, res) {
  fs.appendFile(dataFile, req.body + "\n")
  setTimeout(() => {
    res.status(200).json({message: "ok"})
  }, timeout)
})

testServer.post('/1/conversion', function (req, res) {
  fs.appendFile(dataFile, req.body + "\n")
  setTimeout(() => {
    res.status(200).json({message: "ok"})
  }, timeout)
})

if (require.main === module) {
  testServer.listen(8080);
}

module.exports = testServer