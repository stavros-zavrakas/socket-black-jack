module.exports = function bindPlayerJoin(socket, gameRoom) {
  socket.on('disconnect', function () {
    if (gameRoom.isGuestJoined(socket.username)) {
      console.log('User disconnected (id=' + socket.id + ' - username=' + socket.username + ').');
    }
  });
}
