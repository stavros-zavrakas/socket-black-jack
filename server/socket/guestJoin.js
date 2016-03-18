module.exports = function bindGuestJoin (socket, gameRoom, player) { 
  // guest joined
  socket.on('guest joined', function (username) {
    if (gameRoom.isGuestJoined(username)) {
      // @todo: give back a response ONLY to the specific user
      return;
    }

    player.setUsername(username);
    gameRoom.guestJoin(player);

    // we store the username in the socket session for this client
    socket.username = username;
    console.info('New guest joined (username=' + username + ').');

    // echo globally (all clients) that a guest entered the room
    socket.broadcast.emit('guest joined callback', {
      username: username,
    });
  });
}
