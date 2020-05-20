import jwt_decode from 'jwt-decode';

export const getCookie = (cname) => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

export const getUserFromCookie = () => {
    var cookie = getCookie("usertoken");
    if(cookie !== '')
        return (jwt_decode(cookie).identity.name);
    return '';
}

export const setUserTokenCookie = (cvalue) => {
    var now = new Date();
    now.setTime(now.getTime() + 30 * 60 * 1000);	//now + 30 mins or 30 * 60 * 1000 msecs
    var expiry = "expires=" + now.toUTCString();	//setting 30 mins expiry
    document.cookie = "usertoken=" + cvalue + ';' + expiry + ";path=/";	//cookie set
}