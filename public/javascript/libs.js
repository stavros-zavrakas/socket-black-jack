(function (global, document, $, undefined) {
  
  function libs () {
    return new libs.init();
  }

  libs.prototype = {
    redirect: function (url) {
      window.location = url;
    },
    getCookie: function (cname) {
      var name = cname + '=';
      var ca = document.cookie.split(';');
      for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
          return c.substring(name.length,c.length);
        }
      }
      return null;
    },
    setCookie: function (cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      var expires = 'expires='+d.toUTCString();
      document.cookie = cname + '=' + cvalue + '; ' + expires;
    },
    isLoggedIn: function (username) {
      if (!username) {
        return false;
      }
      
      return true;
    }
  };

  libs.init = function (argument) {
    
  }

  libs.init.prototype = libs.prototype;

  global.bjLibs = libs();

}(window, document, jQuery))