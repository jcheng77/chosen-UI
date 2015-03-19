SSR.compileTemplate('head', Assets.getText('template/head.html'));
SSR.compileTemplate('tops', Assets.getText('template/tops.html'));
SSR.compileTemplate('car_item', Assets.getText('template/car_item.html'));
SSR.compileTemplate('recommends', Assets.getText('template/recommends.html'));

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
  return car.hd_pics && car.hd_pics.length && car.good_comments;
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

Router.route('/tops', function() {
  this.response.end(SSR.render('tops', {
    title: '热门推荐'
  }));
}, {
  where: 'server'
});
Router.route('/recommends', function() {
  this.response.end(SSR.render('recommends', {
    title: '猜你喜欢'
  }));
}, {
  where: 'server'
});
Router.route('/', function() {
  this.response.writeHead(302, {
    'Location': '/tops'
  });
  this.response.end();
}, {
  where: 'server'
});
