(function (io, bjLibs) {
  
  var username = bjLibs.getCookie('username');
  if (!bjLibs.isLoggedIn(username)) {
    bjLibs.redirect('/');
  }

  var bjSocketObj = bjSocket(io, username);
  bjSocketObj.bind();

  bjDomEventsObj = bjDomEvents(bjSocketObj, username);
  bjDomEventsObj.bind();

}(io, bjLibs));