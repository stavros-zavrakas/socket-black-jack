module.exports = function bindPlayerJoin(socket) {
  // get card
  socket.on('get card', function (msg) {
    console.log('message received: ' + msg + ' from: ' + socket.username);
    // io.emit('get card', msg);
    socket.broadcast.emit('get card', {
      username: socket.username,
      message: msg
    });
  });
}
