(function (io, bjLibs) {
  
  var username = bjLibs.getCookie('username');
  if (!bjLibs.isLoggedIn(username)) {
    bjLibs.redirect('/');
  }

  var bjSocketObj = new bjSocket(io, username);
  bjSocketObj.bind();

  bindBjDomEvents(bjSocketObj, username);

}(io, bjLibs));