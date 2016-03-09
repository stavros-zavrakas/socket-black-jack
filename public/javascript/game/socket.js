(function (global) {

  function bjSocket (io) {
    return bjSocket.init(io);
  }

  bjSocket.prototype = {
    bind: function() {

      self.socket.emit('guest joined', username);

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

    }
  };

  bjSocket.init = function (io) {
    var self = this;

    self.socket = io();
  }

  bjSocket.init.prototype = bjSocket.prototype;

  global.bjSocket = bjSocket;

}(window));
