var socketIo = require('socket.io');

var Game = require('../engine/game');
var Player = require('../engine/player');

var bindGuestJoin = require('./guestJoin');
var bindPlayerJoin = require('./playerJoin');
var bindGetCard = require('./getCard');
var bindDisconnect = require('./disconnect');

function init(http) {
  console.log('Socket.io initialization');

  var io = socketIo(http);
  var gameRoom = new Game();

  io.on('connection', function (socket) {
    console.info('New guest connected (id=' + socket.id + ').');
    
    var player = new Player(socket.id, socket);

    bindGuestJoin(socket, gameRoom, player);

    bindPlayerJoin(socket, gameRoom, player)

    bindGetCard(socket);

    bindDisconnect(socket, gameRoom);
  });
}

module.exports = {
  init: init
};