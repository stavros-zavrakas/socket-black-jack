(function (global) {

  function bjSocket(io, username) {
    var self = this;

    self.socket = io();
    self.username = username;
  }

  bjSocket.prototype = {
    bind: function () {
      var self = this;

      self.socket.emit('guest joined', self.username);

      self.socket.on('login', function (data) {
        // Display the welcome message
        var message = 'Welcome to Socket.IO Black jack';
        console.log(message);
      });

      self.socket.on('get card', function (data) {
        $('#messages').append($('<li>').text(data.username + ': ' + data.message));
      });

      self.socket.on('guest joined callback', function (data) {
        console.log(data.username + ' joined');
      });
    },
    getSocket: function () {
      var self = this;

      return this.socket;
    }
  };

  global.bjSocket = bjSocket;

}(window));
