/**
 * Create Google OAuth2 Client
 *
 * @param {String} clientId
 * @param {String} clientSecret
 * @return {GoogleOAuth2Client}
 */
function create(clientId, clientSecret) {
  return new GoogleOAuth2Client(clientId, clientSecret);
}

/**
 * Make OAuth request url with parameter
 *
 * @param {String} callbackUrl
 * @param {String} callbackMethod
 * @param {String} scope
 * @param {int} timeout
 */
function makeAuthUrl(callbackUrl, callbackMethod, scope, timeout) {
  throw new Error("This method should be called after create method");
}

/**
 * Handle auth result
 *
 * @param {Object} callback
 * @param {Object} credentials
 */
function handleAuthResult(callback) {
  throw new Error("This method should be called after create method");
}

/**
 * Refresh access token using refresh token
 *
 * @param {String} refreshToken
 * @param {Object} credentials
 */
function refreshAccessToken(refreshToken) {
  throw new Error("This method should be called after create method");
}

(function(global) {
  var GoogleOAuth2Client;
  GoogleOAuth2Client = (function() {
    
    GoogleOAuth2Client.name = 'GoogleOAuth2Client';
    
    function GoogleOAuth2Client(clientId, clientSecret) {
      this.clientId = clientId;
      this.clientSecret = clientSecret;
      this.AUTH_URL = 'https://accounts.google.com/o/oauth2/auth';
      this.TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';
    }
    
    GoogleOAuth2Client.prototype.makeAuthUrl = function(callbackUrl, callbackMethod, scope, timeout) {
      var params = {
        "response_type" : "code",
        "client_id" : this.clientId,
        "redirect_uri" : callbackUrl,
        "state" : ScriptApp.newStateToken().withMethod(callbackMethod).withArgument("callback", callbackUrl).withTimeout(timeout).createToken(),
        "scope" : scope,
        "access_type" : "offline"
      }
      var paramStrings = [];
      for (var name in params) {
        paramStrings.push(name + "=" + encodeURIComponent(params[name]));
      }
      
      return this.AUTH_URL + "?" + paramStrings.join("&");
    }
    
    GoogleOAuth2Client.prototype.fetchAccessToken = function(code, callbackUrl) {
      var response = UrlFetchApp.fetch(this.TOKEN_URL, {
        "method" : "POST",
        payload : {
          "code" : code,
          "client_id" : this.clientId,
          "client_secret" : this.clientSecret,
          "redirect_uri" : callbackUrl,
          "grant_type" : "authorization_code"
        },
        muteHttpExceptions : true
      });
      
      return JSON.parse(response.getContentText());
    }
    
    GoogleOAuth2Client.prototype.handleAuthResult = function(callback) {
      return this.fetchAccessToken(callback.parameter.code, callback.parameter.callback);
    }
    
    GoogleOAuth2Client.prototype.refreshAccessToken = function(refreshToken) {
      var response = UrlFetchApp.fetch(this.TOKEN_URL, {
        "method" : "POST",
        payload : {
          "client_id" : this.clientId,
          "client_secret" : this.clientSecret,
          "refresh_token" : refreshToken,
          "grant_type" : "refresh_token"
        },
        muteHttpExceptions : true
      });
      
      return JSON.parse(response.getContentText());
    }
    
    return GoogleOAuth2Client;
    
  })();
  
  return global.GoogleOAuth2Client = GoogleOAuth2Client;
  
})(this);
