var socketIo = require('socket.io');

var Game = require('../engine/game');
var Player = require('../engine/player');

function init(http) {
  console.log('Socket.io initialization');

  var io = socketIo(http);
  var gameRoom = new Game();

  // Attach the connection socket.io event
  io.on('connection', function (socket) {
    console.info('New guest connected (id=' + socket.id + ').');
    var player;
    var addedPlayer = false;

    // guest joined
    socket.on('guest joined', function (username) {
      if (addedPlayer) {
        return;
      }

      addedPlayer = true;

      // we store the username in the socket session for this client
      socket.username = username;
      console.info('New guest joined (username=' + username + ').');

      player = new Player(username, socket);
      gameRoom.guestJoined(player);

      // echo globally (all clients) that a person has connected
      socket.broadcast.emit('guest joined callback', {
        username: username,
      });

    });

    // get card
    socket.on('get card', function (msg) {
      console.log('message received: ' + msg + ' from: ' + socket.username);
      // io.emit('get card', msg);
      socket.broadcast.emit('get card', {
        username: socket.username,
        message: msg
      });
    });

    // disconnect
    socket.on('disconnect', function () {
      if (addedPlayer) {
        console.log('User disconnected (id=' + socket.id + ' - username=' + socket.username + ').');
      }
    });
  });
}

module.exports = {
  init: init
};