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
