var appId = 'wxcda8da689f673ea2';
var configWeixinJsApi = function() {
  // 配置微信jSAPI
  var nonceStr = parseInt((Math.random() * 100000000000), 10),
    timestamp = new Date().getTime(),
    url = Router.current().originalUrl;
  Meteor.call('getJsApiSignature', nonceStr, timestamp, url, function(error, signature) {
    if (signature && wx) {
      wx.ready(function() {
        Session.set('wxJsApiReady', true);
      });
      wx.error(function(res) {
        alert(res);
      });

      wx.config({
        debug: true,
        appId: appId,
        nonceStr: nonceStr,
        timestamp: timestamp,
        signature: signature,
        jsApiList: ['onMenuShareTimeline']
      });
      // 避免router切换时候重复配置
      Session.set('wxJsApiConfigured', true);
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
  onAfterAction: function() {
    if (!Session.get("wxJsApiConfigured")) {
      configWeixinJsApi();
    }
  }
});