(function (bjLibs) {

  var socket = io();

  bjDomEventsObj = bjDomEvents(bjLibs);
  bjDomEventsObj.bind();

}(bjLibs));
