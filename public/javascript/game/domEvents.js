(function (global, $) {

  function bjDomEvents(socket, username) {
    return new bjDomEvents.init(socket, username);
  }

  bjDomEvents.prototype = {
    bind: function () {

      $('form').submit(function () {
        self.socket.emit('get card', $('#m').val());

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
