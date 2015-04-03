var Match = new Mongo.Collection('match');
//数据发布
Meteor.publish('car', function(serialId) {
  return Car.find({
    serial_id: serialId
  }, {
    fields: {
      serial_id: 1,
      serial_name: 1,
      hd_pics: 1,
      labels: 1,
      good_comments: 1,
      bad_comments: 1,
      serial_low_price: 1,
      serial_high_price: 1
    }
  });
});

Meteor.publish('view_count', function(serialId) {
  return ViewCount.find({
    serial_id: serialId
  });
});

Meteor.publish('similar_cars', function(serialId) {
  var car = Car.findOne({
    serial_id: serialId
  });
  var similar_ids = _(car.serial_competion).map(function(comp) {
    return parseInt(comp.serial_id, 10);
  });
  if(car) {
    return Car.find({
      serial_id: {
        $in: similar_ids
      }
    }, {
      fields: {
        serial_id: 1,
        serial_name: 1,
        hd_pics: 1,
        good_comments: 1,
        bad_comments: 1,
        serial_low_price: 1,
        serial_high_price: 1
      }
    });
  } else {
    return [];
  }
});

Meteor.publish('top_views', function() {
  return ViewCount.find({}, {
    limit: 10,
    sort: {
      count: -1
    }
  }, {
    fields: {
      serial_id: 1,
      serial_name: 1,
      hd_pics: 1,
      good_comments: 1,
      bad_comments: 1,
      serial_low_price: 1,
      serial_high_price: 1
    }
  });
});
//TODO - join view & cars in one query
Meteor.publish('top_cars', function() {
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
  }, {
    fields: {
      serial_id: 1,
      serial_name: 1,
      hd_pics: 1,
      good_comments: 1,
      bad_comments: 1,
      serial_low_price: 1,
      serial_high_price: 1
    }
  });
});

var autoCons = AutoCon.find().fetch(); //TODO 优化查询

Meteor.publish('filtered_cars', function(targePrice, targetCats) {
  var titles = _(targetCats).map(function(cat) {
    return cat.title
  });
  var filterdCons = _(autoCons).filter(function(autoCon) {
    var isGood = true;
    _(titles).each(function(title) {
      var con = _(autoCon.con).find(function(con) {
        return con.title === title;
      });
      if(!con || con.rank < 4.5) {
        isGood = false;
      }
    });
    return isGood;
  });
  var matchedIds = _(filterdCons).map(function(autoCon) {
    return autoCon.serial_id;
  });

  return Car.find({
    serial_id: {
      $in: matchedIds
    },
    good_comments: {
      $ne: ''
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
      font_score: 1
    },
    sort: {
      font_score: -1
    }
  });
});
Meteor.publish('cars_by_dir', function(dir) {
  var cursor = Car.find({
    serial_use_way: {
      $regex: new RegExp(dir)
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
  return cursor;
});
Meteor.publish('ticheji_by_sid', function(sid) {
  var match = Match.findOne({tSId: sid});
  if (!match) {
    return [];
  }
  return Ticheji.find({
    sid: match.aSId
  }, {
    fields: {
      sid: 1,
      'articles.author': 1,
      'articles.url': 1,
      'articles.title': 1,
      'articles.replies': 1,
      'articles.date': 1,
      'articles.desc': 1
    }
  });
});