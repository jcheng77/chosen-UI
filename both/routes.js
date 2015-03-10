var appId = 'wxcda8da689f673ea2';
var configWeixinJsApi = function() {
  // 配置微信jSAPI
  var url = Router.current().originalUrl;

  // 避免router切换时候重复配置
  Session.set('wxJsApiConfigured', true);
  Meteor.call('getJsApiSignature', url, function(error, config) {
    if(config && wx) {
      wx.ready(function() {
        Session.set('wxJsApiReady', true);
        var car = Car.findOne({
          serial_id: Session.get('serial_id')
        });
        var goodComments = car.good_comments.split('|');
        if(goodComments && goodComments.length > 3) {
          goodComments = goodComments.splice(0, 3);
        }
        wx.onMenuShareTimeline({
          title: '我正在考虑选购' + car.serial_name + ',请身边高手点评一下吧',
          link: Router.current().originalUrl,
          imgUrl: car.hd_pics.length && car.hd_pics[0]
        });
        wx.onMenuShareAppMessage({
          title: '我正在考虑选购' + car.serial_name + ',请身边高手点评一下吧',
          desc: goodComments.join('; '),
          link: Router.current().originalUrl,
          imgUrl: car.hd_pics.length && car.hd_pics[0]
        });
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
  });
};

var subs = new SubsManager();

Router.configure({
  layoutTemplate: 'layout'
});

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
  onRun: function() {
    if(!Session.get("wxJsApiReady")) {
      configWeixinJsApi();
    }
    var serial_id = Session.get('serial_id');
    Meteor.call('increaseViewCount', serial_id);
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
  onRun: function() {
    configWeixinJsApi();
  },
  fastRender: true
});
