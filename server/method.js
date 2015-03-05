var AccessToken = new Mongo.Collection('wechat_access_tokens');
var JsApiTicket = new Mongo.Collection('wechat_jsapi_tickets');

var appId = 'wxcda8da689f673ea2';
var appSecret = '0c5cafed0f4c8e04b5dafe310d0df9b2';

var isTokenExpired = function(token) {
  if (!token) {
    return true;
  }
  var timeSinceCreated = (new Date().getTime() - token.createdDate.getTime()) / 1000;
  return timeSinceCreated > token.expiresIn;
}

Meteor.methods({
  getAccessToken: function() {
    var accessToken = AccessToken.findOne({
        appId: appId
      });

    if (isTokenExpired(accessToken)) {
      var tokenRes = HTTP.post("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" + appSecret);
      if (tokenRes.statusCode === 200) {
        console.log(tokenRes);
        var token = tokenRes.data["access_token"];
        if (token) {
          accessToken = {
            appId: appId,
            token: token,
            expiresIn: tokenRes.data["expires_in"],
            createdDate: new Date()
          };
          AccessToken.upsert({
            appId: appId
          }, accessToken);
          console.log('METHOD:getCorpToken: renew current access token');
        }
      } else {
        throw new Meteor.Error(tokenRes);
      }
    } else {
      console.log('METHOD:getCorpToken: using current access token');
    }
    return accessToken;
  },
  getJsApiTicket: function() {
    var jsApiTicket = JsApiTicket.findOne({appId: appId});
    if (isTokenExpired(jsApiTicket)) {
      var accessToken = Meteor.call('getAccessToken');
      if (accessToken) {
        var ticketRes = HTTP.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + accessToken.token + "&type=jsapi");
        if (ticketRes.statusCode === 200) {
          console.log("METHOD:getJsApiTicket:ticketRes", ticketRes);
          var ticket = ticketRes.data["ticket"];
          if (ticket) {
            jsApiTicket = {
              appId: appId,
              ticket: ticket,
              expiresIn: ticketRes.data["expires_in"],
              createdDate: new Date()
            };
            JsApiTicket.upsert({
              appId: appId
            }, jsApiTicket);
            console.log('METHOD:getJsApiTicket: renew current jsApi ticket');
          }
        } else {
          throw new Meteor.Error(ticketRes);
        }
      }
    } else {
      console.log('METHOD:getJsApiTicket: using current jsApi ticket')
    }
    return jsApiTicket && jsApiTicket.ticket;
  },
  getJsApiSignature: function(nonceStr, timestamp, url) {
    var ticket = Meteor.call('getJsApiTicket') || '';
    var crypto = Npm.require('crypto');
    var shasum = crypto.createHash('sha1');
    var arr = ['noncestr=' + nonceStr, 'timestamp=' + timestamp, 'jsapi_ticket=' + ticket, 'url=' + url].sort();
    var string1 = arr.join('&');
    shasum.update(string1);
    return shasum.digest('hex');
  }
});