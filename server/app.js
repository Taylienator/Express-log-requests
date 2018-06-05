const express = require('express');
const fs = require('fs');
const app = express();
const date = new Date();

app.use((req, res, next) => {

  var csvOutput = req.get('user-agent') + ',' + date.toISOString() + ',' + req.method + ',' + req.path + ',' + 'HTTP/' + req.httpVersion + ',' + res.statusCode + '\n';
  fs.appendFile(__dirname + '/log.csv', csvOutput, (err) => {    //<= this is a working append function! 
    if (err) throw err;
  })
  console.log(csvOutput);
  next();
 
});

app.get('/', (req, res) => {
  res.send('OK');
});


app.get('/logs', (req, res) => {
  var data = fs.readFileSync(__dirname + '/log.csv');
  data = data.toString();

 
  var lines = data.split("\n");
  var result = [];
  var headers = lines[0].split(",");
  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  res.send(result);
});

module.exports = app;