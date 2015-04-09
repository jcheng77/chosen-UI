SSR.compileTemplate('head', Assets.getText('template/head.html'));
SSR.compileTemplate('tops', Assets.getText('template/tops.html'));
SSR.compileTemplate('car_item', Assets.getText('template/car_item.html'));
SSR.compileTemplate('recommends', Assets.getText('template/recommends.html'));
SSR.compileTemplate('share', Assets.getText('template/share.html'));
SSR.compileTemplate('dir_list', Assets.getText('template/dir_list.html'));
SSR.compileTemplate('dir_list_result', Assets.getText('template/dir_list_result.html'));

Template.registerHelper('cssUrl', function() {
  var cssUrl = _.pluck(_.filter(
    WebApp.clientPrograms['web.browser'].manifest,
    function(i) {
      return i.type === "css";
    }
  ), "url");
  return cssUrl;
});

Template.registerHelper('goodComments', function() {
  var car = this;
  return car.good_comments ? car.good_comments.split('|') : [];
});
Template.registerHelper('badComments', function() {
  var car = this;
  return car.bad_comments ? car.bad_comments.split('|') : [];
});
Template.registerHelper('notBadData', function() {
  var car = this;
  return car.hd_pics && car.hd_pics.length;
});
Template.registerHelper('thumbImageUrl', function() {
  var car = this;
  if(car.hd_pics && car.hd_pics.length) {
    return car.hd_pics[0];
  } else {
    return "";
  }
});

Template.registerHelper('tops', function() {
  var topIds = ViewCount.find({}, {
    limit: 10,
    sort: {
      count: -1
    }
  }).map(function(view) {
    return view.serial_id;
  });
  var tops = Car.find({
    serial_id: {
      $in: topIds
    }
  }).fetch();
  tops.sort(function(car1, car2) {
    var view1 = ViewCount.findOne({
      serial_id: car1.serial_id
    });
    var view2 = ViewCount.findOne({
      serial_id: car2.serial_id
    });
    return(view1 ? view1.count : 0) < (view2 ? view2.count : 0);
  });
  return tops;
});

Template.registerHelper('dirs', function() {
  var dirs = [{
    dir_name: '商务',
    title: '商务人士',
    desc: '稳重 大气',
    image: '/images/dirs/business.png'
  }, {
    dir_name: '家用',
    title: '家庭用车',
    desc: '舒适 实用',
    image: '/images/dirs/family.png'
  }, {
    dir_name: '时尚',
    title: '单身贵族',
    desc: '个性 时尚',
    image: '/images/dirs/single.png'
  }, {
    dir_name: '男性',
    title: '时尚男性',
    desc: '帅气迷人',
    image: '/images/dirs/bigguy.png'
  }, {
    dir_name: '女性',
    title: '时尚女性',
    desc: '颜值爆表',
    image: '/images/dirs/women.png'
  }, {
    dir_name: '代步',
    title: '代步一族',
    desc: '实惠实用',
    image: '/images/dirs/commute.png'
  }, {
    dir_name: '运动',
    title: '自由操控',
    desc: '动感十足',
    image: '/images/dirs/drive-free.png'
  }, {
    dir_name: '越野',
    title: '休闲越野',
    desc: '动感十足',
    image: '/images/dirs/leisure.png'
  }];
  return dirs;
});

Router.route('/', function() {
  this.response.writeHead(302, {
    'Location': '/tops'
  });
  this.response.end();
}, {
  where: 'server'
});

Router.route('/tops', function() {
  this.response.writeHead(200, {
    "cache-control": 'public, max-age=3600'
  });
  this.response.end(SSR.render('tops', {
    title: '热门推荐'
  }));
}, {
  where: 'server'
});
Router.route('/recommends', function() {
  this.response.writeHead(200, {
    "cache-control": 'public, max-age=3600'
  });
  this.response.end(SSR.render('recommends', {
    title: '猜你喜欢'
  }));
}, {
  where: 'server'
});

Router.route('/dirs', function() {
  this.response.writeHead(200, {
    "cache-control": 'public, max-age=3600'
  });
  this.response.end(SSR.render('dir_list', {
    title: '分类推荐'
  }));
}, {
  where: 'server'
});
Router.route('/dirs/:dir_name', function() {
  this.response.writeHead(200, {
    "cache-control": 'public, max-age=3600'
  });
  var cursor = Car.find({
    serial_use_way: {
      $regex: new RegExp(this.params.dir_name)
    }
  }, {
    fields: {
      serial_id: 1,
      serial_name: 1,
      hd_pics: 1,
      good_comments: 1,
      bad_comments: 1,
      serial_low_price: 1,
      serial_high_price: 1,
      serial_pic: 1,
      serial_use_way: 1
    },
    limit: 30
  });
  this.response.end(SSR.render('dir_list_result', {
    title: '分类推荐',
    cars: cursor.fetch()
  }));
}, {
  where: 'server'
});

//诱导分享页面
Router.route('/share', function() {
  var url = process.env.ROOT_URL + 'share';
  var wxConfig = Meteor.call('getJsApiSignature', url);
  this.response.end(SSR.render('share', {
    jssdkApi: true,
    wxConfig: JSON.stringify(wxConfig),
    originUrl: 'http://mp.weixin.qq.com/s?__biz=MzAwNzE2MzA4Ng==&mid=206790339&idx=5&sn=c6181cb3050224bea87673c7a691a4f6#rd',
    doneUrl: 'http://mp.weixin.qq.com/s?__biz=MzAwNzE2MzA4Ng==&mid=206116553&idx=1&sn=0de8cb0878755e72aef918c3aeeec3cd#rd'
  }));
}, {
  where: 'server'
});
