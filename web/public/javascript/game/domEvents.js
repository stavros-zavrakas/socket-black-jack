(function (global, $) {

  function bjDomEvents(socket, username) {
    return new bjDomEvents.init(socket, username);
  }

  bjDomEvents.prototype = {
    bind: function () {
      var self = this;

      $('.js-bj-join').click(function () {
        var socketObj = self.socket.getSocket();
        socketObj.emit('player joined', self.username);

        $('#messages').append($('<li>').text(self.username + ': ' + $('#m').val()));
        $('#m').val('');

        return false;
      });

    }
  };

  bjDomEvents.init = function (socket, username) {
    var self = this;

    self.socket = socket;
    self.username = username;
  }

  bjDomEvents.init.prototype = bjDomEvents.prototype;

  global.bjDomEvents = bjDomEvents;

}(window, jQuery));
