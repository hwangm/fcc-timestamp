// server.js
// where your node app starts

// init project
var moment = require('moment');
var express = require('express');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/*", function (request, response) {
  var path = request.path.split('/')[1];
  if (path.indexOf('%20') != -1){
    path = path.split('%20');
    isNaturalLanguageDate(path, (err, data) => {
      if (err) {
        response.send({
          'unix': null,
          'natural': null
        });
      }
      response.send(data);
    });
  }
  else {
    isUnixDate(path, (err, data) => {
      if (err) {
        response.send({
          'unix': null,
          'natural': null
        });
      }
      response.send(data);
    });
  }

});

function isNaturalLanguageDate(arr, callback) {
  if(arr.length != 3) return callback('This is a String but not a natural language date.');
  var d = moment(arr.join(' '), 'MMMM DD, YYYY');
  if (!d.isValid()) return callback('This is an invalid date');
  return callback(null, {
    'unix': d.unix(),
    'natural': d.format('MMMM DD, YYYY')
  });
}

function isUnixDate(path, callback){
  if (isNaN(+path)) return callback('This is a String but not a natural language date.');
  var t = +path;
  var d = moment.unix(t);
  if (!d.isValid()) return callback('This is an invalid date');
  return callback(null, {
    'unix': d.unix(),
    'natural': d.format('MMMM DD, YYYY')
  });
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
