// Signature util
var createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
};

var createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + '';
};

var raw = function (args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};

/**
* @synopsis 签名算法
*
* @param jsapi_ticket 用于签名的 jsapi_ticket
* @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
*
* @returns
*/
var sign = function (jsapi_ticket, url) {
  var ret = {
    jsapi_ticket: jsapi_ticket,
    nonceStr: createNonceStr(),
    timestamp: createTimestamp(),
    url: url
  };
  var string = raw(ret);
      jsSHA = Npm.require('jssha');
      shaObj = new jsSHA(string, 'TEXT');
  ret.signature = shaObj.getHash('SHA-1', 'HEX');

  return ret;
};

Wechat = Wechat || {};
Wechat.sign = sign;

//oauth util

var appId = 'wxd428caf50280d60d';
var appSecret = '95b91187b2a71dba0e515a683aa1b35e';
// register an empty configuration to ensure oauth backend works
ServiceConfiguration.configurations.upsert({
  service: "wechat"
}, {
  service: "wechat",
  loginStyle: "redirect",
  appId: appId,
  appSecret: appSecret
});

function getAuthToken(code) {
  try {
    var authTokenRes = HTTP.get(
      "https://api.weixin.qq.com/sns/oauth2/access_token", {
        params: {
          appid: appId,
          secret: appSecret,
          code: code,
          grant_type: 'authorization_code'
        }
      });
    return authTokenRes.content ? JSON.parse(authTokenRes.content) : authTokenRes.data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch authorization token from wechat. " + err.message), {
      response: err.response
    });
  }
};

function getIdentity(tokenResponse) {
  try {
    var userInfoRes = HTTP.get(
      "https://api.weixin.qq.com/sns/userinfo", {
        params: {
          access_token: tokenResponse.access_token,
          openid: tokenResponse.openid
        }
      });
    console.log(userInfoRes);
    return userInfoRes.content ? JSON.parse(userInfoRes.content) : userInfoRes.data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from wechat. " + err.message), {
      response: err.response
    });
  }
};

OAuth.registerService('wechat', 2, null, function(query) {
  var tokenResponse = getAuthToken(query.code);
  var openId = tokenResponse.openid;
  if (query.requestUserInfo === 'true') {
    var identity = getIdentity(tokenResponse);
    return {
      serviceData: {
        id: identity.openid,
        username: identity.openid
      },
      options: {
        profile: identity
      }
    };
  } else {
    return {
      serviceData: {
        id: openId,
        username: openId
      }
    };
  }
});


Wechat.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};