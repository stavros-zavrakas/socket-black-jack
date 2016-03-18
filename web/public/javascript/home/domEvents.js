(function (global, $) {

  function bjDomEvents(bjLibs) {
    return new bjDomEvents.init(bjLibs);
  }

  bjDomEvents.prototype = {
    bind: function () {

      $('form').submit(function () {
        var username = $('#username').val();

        self.bjLibs.setCookie('username', username, 10);

        self.bjLibs.redirect('/game');
        
        return false;
      });

    }
  };

  bjDomEvents.init = function (bjLibs) {
    var self = this;

    self.bjLibs = bjLibs;
  }

  bjDomEvents.init.prototype = bjDomEvents.prototype;

  global.bjDomEvents = bjDomEvents;

}(window, jQuery));
