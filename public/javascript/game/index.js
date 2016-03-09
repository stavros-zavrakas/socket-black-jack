(function (io, bjLibs) {
  
  var username = bjLibs.getCookie('username');
  if (!bjLibs.isLoggedIn(username)) {
    bjLibs.redirect('/');
  }

  var bjSocketObj = bjSocket(io);
  bjSocketObj.bind();

  bjDomEventsObj = bjDomEvents(bjSocket, username);
  bjDomEventsObj.bind();

}(io, bjLibs));