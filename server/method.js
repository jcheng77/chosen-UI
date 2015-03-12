var AccessToken = new Mongo.Collection('wechat_access_tokens');
var JsApiTicket = new Mongo.Collection('wechat_jsapi_tickets');

var appId = 'wxcda8da689f673ea2';
var appSecret = '0c5cafed0f4c8e04b5dafe310d0df9b2';

var isTokenExpired = function(token) {
  if(!token) {
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

    if(isTokenExpired(accessToken)) {
      var tokenRes = HTTP.post("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" + appSecret);
      if(tokenRes.statusCode === 200) {
        console.log(tokenRes);
        var token = tokenRes.data["access_token"];
        if(token) {
          accessToken = {
            appId: appId,
            token: token,
            expiresIn: tokenRes.data["expires_in"],
            createdDate: new Date()
          };
          //TODO - make upsert defer
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
    var jsApiTicket = JsApiTicket.findOne({
      appId: appId
    });
    if(isTokenExpired(jsApiTicket)) {
      var accessToken = Meteor.call('getAccessToken');
      if(accessToken) {
        var ticketRes = HTTP.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + accessToken.token + "&type=jsapi");
        if(ticketRes.statusCode === 200) {
          console.log("METHOD:getJsApiTicket:ticketRes", ticketRes);
          var ticket = ticketRes.data["ticket"];
          if(ticket) {
            jsApiTicket = {
              appId: appId,
              ticket: ticket,
              expiresIn: ticketRes.data["expires_in"],
              createdDate: new Date()
            };
            // TODO - make upsert defer
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
  getJsApiSignature: function(url) {
    var ticket = Meteor.call('getJsApiTicket') || '';
    return Wechat.sign(ticket, url);
  },
  increaseViewCount: function(serial_id) {
    this.unblock();
    ViewCount.upsert({
      serial_id: serial_id
    }, {
      $inc: {
        count: 1
      },
      $set: {
        serial_id: serial_id
      }
    });
  },
  addInterestCar: function(serial_id) {
    if(this.userId) {
      this.unblock();
      var openid = Meteor.user().services.wechat ? Meteor.user().services.wechat.id : null;
      Interest.upsert({
        openid: openid
      }, {
        $addToSet: {
          interests: serial_id
        }
      });
    }
  },
  recommend: function(debugMode) {
    var interests = [];
    if(this.userId) {
      var user = Meteor.users.findOne(this.userId);
      var openid = user.services.wechat ? user.services.wechat.id : null;
      var log = Interest.findOne({
        openid: openid
      });
      if(log) {
        interests = log.interests;
      }
    } else if(debugMode) {
      interests = [218];
    } else {
      //如果还没浏览过，则返回系统中的热门车型
      var topIds = ViewCount.find({}, {
        limit: 10,
        sort: {
          count: -1
        }
      }).map(function(view) {
        return view.serial_id;
      });

      return Car.find({
        serial_id: {
          $in: topIds
        }
      }).fetch();
    }
    //浏览过的车型，或者相似车型里包含有浏览过的车型(TODO)
    var cars = Car.find({
      serial_id: {
        $in: interests
      }
    }, {
      limit: 10
    });
    console.log(interests)
    return cars.fetch();
  }
});
