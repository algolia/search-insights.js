/*
  Used for serving static build file to do async js library loading and testing,
  Can also respond to click, search and conversion events with random id's
*/
/* eslint-disable import/no-commonjs */
const express = require('express');
const testServer = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const dataFile = './tests/data.txt';
const timeout = 1000;

testServer.use(cors());
testServer.use(bodyParser.json());
testServer.use(bodyParser.text());
testServer.use(express.static(path.join(__dirname, './../dist')));
testServer.use(express.static(path.join(__dirname, './../tests/production')));

testServer.post('/1/events', function(req, res) {
  fs.appendFile(dataFile, `${req.body}\n`, () => {
    setTimeout(() => {
      res.status(200).json({ message: 'ok' });
    }, timeout);
  });
});

if (require.main === module) {
  testServer.listen(8080);
}

module.exports = testServer;
/* eslint-enable import/no-commonjs */
