(function (global, $) {

  function bindBjDomEvents(socket, username) {
    var self = this;

    self.socket = socket;
    self.username = username;

    $('.js-bj-join').click(function () {
      var socketObj = self.socket.getSocket();
      socketObj.emit('player joined', self.username);

      $('#messages').append($('<li>').text(self.username + ': ' + $('#m').val()));
      $('#m').val('');

      return false;
    });

  };

  global.bindBjDomEvents = bindBjDomEvents;

}(window, jQuery));
