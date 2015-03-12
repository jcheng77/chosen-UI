var appId = 'wxcda8da689f673ea2';

var configWeixinJsApiOnRun = function() {
  if(!isWeixinClient()) {
    return this.next();
  }
  // 配置微信jSAPI
  var url = Router.current().originalUrl;
  // work around iron router bug - on second run, the url is relative
  if (url.indexOf('http') < 0) {
    url = __meteor_runtime_config__.ROOT_URL + url.substring(1, url.length);
  }
  var serial_id = parseInt(this.params.serial_id, 10);

  Meteor.call('getJsApiSignature', url, function(error, config) {
    if(config && wx) {
      wx.ready(function() {
        Session.set('wxJsApiReady', true);
        var car = Car.findOne({
          serial_id: serial_id
        });
        var goodComments = car.good_comments && car.good_comments.split('|');
        if(goodComments && goodComments.length > 3) {
          goodComments = goodComments.splice(0, 3);
        }
        var message = {
          title: '我正在考虑选购' + car.serial_name + ',请身边高手点评一下吧',
          desc: goodComments.join('; '),
          link: url,
          imgUrl: car.hd_pics.length && car.hd_pics[0]
        };
        // alert(JSON.stringify(message));
        wx.onMenuShareTimeline(message);
        wx.onMenuShareAppMessage(message);
      });
      wx.error(function(res) {
        Session.set('wxJsApiReady', false);
      });

      wx.config({
        debug: false,
        appId: appId, // 必填，公众号的唯一标识
        timestamp: config.timestamp, // 必填，生成签名的时间戳
        nonceStr: config.nonceStr, // 必填，生成签名的随机串
        signature: config.signature, // 必填，签名，见附录1
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'hideMenuItems',
          'showMenuItems',
          'hideAllNonBaseMenuItem',
          'showAllNonBaseMenuItem',
          'translateVoice',
          'startRecord',
          'stopRecord',
          'onRecordEnd',
          'playVoice',
          'pauseVoice',
          'stopVoice',
          'uploadVoice',
          'downloadVoice',
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage',
          'getNetworkType',
          'openLocation',
          'getLocation',
          'hideOptionMenu',
          'showOptionMenu',
          'closeWindow',
          'scanQRCode',
          'chooseWXPay',
          'openProductSpecificView',
          'addCard',
          'chooseCard',
          'openCard'
        ]
      });
    }
    this.next();
  });
};

function authWithWechatBeforeAction() { //wechat oauth2 for mobile app pages
  var debug = (this.params.query.debug === 'true');
  if(!debug && isWeixinClient() && !Meteor.userId()) {
    // if (true) {
    // if the user is not logged in, redirect to wechat oauth2 login
    if(Accounts.loginServicesConfigured()) {
      Meteor.loginWithWechat({
        requestUserInfo: false
      }, function(error) {
        // do nothing
      });
    }
  } else {
    this.next();
  }
};

function increateViewCountOnRun() {
  Meteor.call('increaseViewCount', parseInt(this.params.serial_id, 10));
  this.next();
}

function addInterestOnRun() {
  if (isWeixinClient()) {
    Meteor.call('addInterestCar', parseInt(this.params.serial_id, 10));
  }
  this.next();
}

var subs = new SubsManager();

Router.configure({
  layoutTemplate: 'layout'
});

Router.onRun(increateViewCountOnRun, {only: ['car.comments']});
Router.onRun(addInterestOnRun, {only: ['car.comments']});
Router.onRun(configWeixinJsApiOnRun, {only: ['car.comments']});

Router.onBeforeAction(authWithWechatBeforeAction, {only: 'car.comments'});


Router.route('/car/:serial_id', {
  template: 'car',
  name: 'car.comments',
  waitOn: function() {
    var serial_id = parseInt(this.params.serial_id, 10);
    if(Meteor.isClient) {
      Session.set('serial_id', serial_id);
    }
    subs.subscribe('car', serial_id);
    subs.subscribe('view_count', serial_id);
  },
  fastRender: true
});

Router.route('/car/:serial_id/similars', {
  template: 'similars',
  name: "car.similars",
  waitOn: function() {
    var serial_id = parseInt(this.params.serial_id, 10);
    if(Meteor.isClient) {
      Session.set('serial_id', serial_id);
    }
    subs.subscribe('car', serial_id);
    subs.subscribe('similar_cars', serial_id);
  },
  fastRender: true
});
