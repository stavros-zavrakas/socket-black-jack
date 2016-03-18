module.exports = function bindPlayerJoin(socket, gameRoom, player) {
  socket.on('player joined', function (username) {
    if (gameRoom.isPlayerJoined(username)) {
      // @todo: give back a response ONLY to the specific user
      return;
    }

    gameRoom.playerJoin(player);

    console.info('Player (username=' + username + ') joined the game.');

    // echo globally (all clients) that a player joined the game
    socket.broadcast.emit('player joined callback', {
      username: username,
    });
  });
}
