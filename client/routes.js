var appId = 'wxcda8da689f673ea2';
var configWeixinJsApi = function() {
  // 配置微信jSAPI
  var url = Router.current().originalUrl;

  // 避免router切换时候重复配置
  Session.set('wxJsApiConfigured', true);
  Meteor.call('getJsApiSignature', url, function(error, config) {
    if (config && wx) {
      wx.ready(function() {
        Session.set('wxJsApiReady', true);

      });
      wx.error(function(res) {
        Session.set('wxJsApiReady', false);
      });

      wx.config({
        debug: false,
        appId: appId, // 必填，公众号的唯一标识
        timestamp: config.timestamp, // 必填，生成签名的时间戳
        nonceStr: config.nonceStr, // 必填，生成签名的随机串
        signature: config.signature,// 必填，签名，见附录1
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

Router.route('/car/:serial_id', {
  template: 'main',
  waitOn: function() {
    var serial_id = parseInt(this.params.serial_id, 10);
    Session.set('serial_id', serial_id);
    this.subscribe('car', serial_id);
  },
  onRun: function() {
    if (!Session.get("wxJsApiReady")) {
      configWeixinJsApi();
    }
  }
});