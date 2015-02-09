Meteor.startup(function() {
  var cars = JSON.parse(Assets.getText('cars.json'));
  _(cars).each(function(car) {
    Car.upsert({
      serial_id: car.serial_id
    }, car);
  });
  delete cars;
});
