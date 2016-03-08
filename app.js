var path = require('path');
var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Game = require('./engine/game');
var libs = require('./libs');

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/game', function (req, res, next) {

  io.on('connection', function (socket) {
    console.info('New guest connected (id=' + socket.id + ').');
  });
  
  return next();
}, function (req, res) {
  res.render('game');
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});