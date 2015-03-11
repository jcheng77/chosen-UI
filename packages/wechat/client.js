Wechat = Wechat || {};

// Request Wechat credentials for the user
//
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Wechat.requestCredential = function(options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  var config = ServiceConfiguration.configurations.findOne({
    service: 'wechat'
  });
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
      new ServiceConfiguration.ConfigError());
    return;
  }

  // var credentialToken = Random.secret();
  var credentialToken = '1';

  var loginUrl =
    'https://open.weixin.qq.com/connect/oauth2/authorize' + '?appid=' + config.appId +
    '&redirect_uri=' + OAuth._redirectUri('wechat', config) +
    '&response_type=code&scope=snsapi_userinfo' +
    '&state=' + OAuth._stateParam(config.loginStyle, credentialToken) +
    // '&state=1111' +
    '#wechat_redirect';

  OAuth.launchLogin({
    loginService: "wechat",
    loginStyle: config.loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  });
};