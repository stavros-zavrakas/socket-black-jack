(function (global, $) {

  function bindBjDomEvents(bjLibs) {
    $('form').submit(function () {
      var username = $('#username').val();

      self.bjLibs.setCookie('username', username, 10);

      self.bjLibs.redirect('/game');

      return false;
    });
  }

  global.bindBjDomEvents = bindBjDomEvents;

}(window, jQuery));
