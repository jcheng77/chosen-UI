//数据发布
Meteor.publish('car', function(serialId) {
  return Car.find({
    serial_id: serialId
  }, {
    fields: {serial_id: 1, serial_name: 1, hd_pics: 1, labels: 1, good_comments: 1, bad_comments: 1, serial_low_price: 1, serial_high_price: 1}
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
      fields: {serial_id: 1, serial_name: 1, hd_pics: 1, good_comments: 1, bad_comments: 1, serial_low_price: 1, serial_high_price: 1}
    });
  } else {
    return [];
  }
});