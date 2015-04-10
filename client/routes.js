var appId = 'wxcda8da689f673ea2';

var configWeixinJsApiOnRun = function() {
  if(!isWeixinClient()) {
    return this.next();
  }
  // 配置微信jSAPI
  var url = Router.current().originalUrl;
  // work around iron router bug - on second run, the url is relative
  if(url.indexOf('http') < 0) {
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
  if(isWeixinClient()) {
    Meteor.call('addInterestCar', parseInt(this.params.serial_id, 10));
  }
  this.next();
}

var subs = new SubsManager();

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.onRun(increateViewCountOnRun, {
  only: ['car.comments']
});
Router.onRun(addInterestOnRun, {
  only: ['car.comments']
});
Router.onRun(configWeixinJsApiOnRun, {
  only: ['car.comments']
});

Router.onBeforeAction(authWithWechatBeforeAction, {
  only: ['car.comments', 'car.recommends']
});

Router.route('/car/:serial_id', {
  template: 'car',
  name: 'car.comments',
  waitOn: function() {
    var serial_id = parseInt(this.params.serial_id, 10);
    if(Meteor.isClient) {
      Session.set('serial_id', serial_id);
    }
    return [subs.subscribe('car_with_viewcount', serial_id)];
  },
  data: function() {
    return Car.findOne({
      serial_id: parseInt(Session.get('serial_id'), 10)
    });
  },
  onAfterAction: function() {
    var car = Car.findOne({
      serial_id: parseInt(Session.get('serial_id'), 10)
    });
    if(car) {
      Session.set('htmlTitle', car.serial_name);
    }
  },
  fastRender: false
});

Router.route('/car/:serial_id/similars', {
  template: 'similars',
  name: "car.similars",
  waitOn: function() {
    var serial_id = parseInt(this.params.serial_id, 10);
    if(Meteor.isClient) {
      Session.set('serial_id', serial_id);
    }
    return [subs.subscribe('car_and_similars', serial_id)];
  },
  fastRender: true
});

Router.route('/car/:serial_id/ticheji', {
  template: 'ticheji',
  name: "car.ticheji",
  waitOn: function() {
    return [Meteor.subscribe('ticheji_by_sid', this.params.serial_id)];
  },
  data: function() {
    return Ticheji.findOne();
  },
  fastRender: true
});

Router.route('/ticheji/:url', {
  template: 'ticheji.detail',
  name: "car.ticheji.detail",
  data: function() {
    var uint8Array = Base64.decode(this.params.url);
    return {
      url: String.fromCharCode.apply(null, uint8Array)
    };
  }
});

//只在phonegap/cordova移动环境才启用这些页面渲染，在web环境下我们用ssr(server side rendering)
//来减少首页渲染时间，代码在server/ssr.js
if(Meteor.isCordova) {
  Router.route('/tops', {
    template: 'tops',
    name: 'car.tops',
    waitOn: function() {
      return [subs.subscribe('top_cars'), subs.subscribe('top_views')];
    },
    onRun: function() {
      Session.set('htmlTitle', "热门推荐");
      this.next();
    },
    fastRender: true
  });

  Router.route('/recommends', {
    template: 'recommends',
    name: 'car.recommends',
    action: function() {
      var that = this;
      Session.set('htmlTitle', "猜你喜欢");
      Meteor.call('recommend', false /*debugMode*/ , function(error, result) {
        if(result && result.length) {
          Session.set('recommends', result);
        }
        that.render();
      });
      this.render('loading');
    }
  });

  Router.route('/dirs', {
    template: 'dir_list',
    name: 'car.dir'
  });
  Router.route('/dirs/:dir_name', {
    template: 'dir_list_result',
    name: 'car.dir_result',
    waitOn: function() {
      return [Meteor.subscribe('cars_by_dir', this.params.dir_name)];
    },
  });

  Router.route('/', function() {
    this.redirect('car.tops');
  });
}

Router.route('/selector', {
  template: 'selector',
  name: 'car.selector'
});

Tracker.autorun(function() {
  var title = "拍立行买车助手"
  if(Session.get('htmlTitle')) {
    title = Session.get('htmlTitle') + '-' + title;
  }
  document.title = title;
});
