// 服务器启动时从静态文件更新数据库
Meteor.startup(function() {
  var cars = JSON.parse(Assets.getText('cars.json'));
  _(cars).each(function(car) {
    Car.upsert({
      serial_id: car.serial_id
    }, car);
  });
  delete cars;
});

//数据发布
Meteor.publish('car', function(serialId) {
  return Car.find({
    serial_id: serialId
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
  });
});