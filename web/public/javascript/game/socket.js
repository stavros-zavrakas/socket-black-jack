(function (global) {

  function bjSocket (io, username) {
    return new bjSocket.init(io, username);
  }

  bjSocket.prototype = {
    bind: function() {
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
      return this.socket;
    }
  };

  bjSocket.init = function (io, username) {
    var self = this;

    self.socket = io();
    self.username = username;
  }

  bjSocket.init.prototype = bjSocket.prototype;

  global.bjSocket = bjSocket;

}(window));
