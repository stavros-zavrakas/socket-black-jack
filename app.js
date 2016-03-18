var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');

var app = express();
var http = require('http').Server(app);

app.use(express.static(path.join(__dirname, 'web/public')));

app.engine('handlebars', exphbs({
  partialsDir: 'web/views/partials',
  layoutsDir: 'web/views/layouts',
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.set('views', 'web/views/')

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/game', function (req, res, next) {
  console.log('game route!');

  return next();
}, function (req, res) {
  res.render('game');
});

var socketServer = require('./server/socket/socket-io');
socketServer.init(http);

http.listen(3000, function () {
  console.log('listening on *:3000');
});
