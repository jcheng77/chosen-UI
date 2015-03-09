Template.registerHelper('goodComments', function(serialId) {
  var car = Car.findOne({
    serial_id: serialId
  });
  return car.good_comments ? car.good_comments.split('|') : [];
});
Template.registerHelper('badComments', function(serialId) {
  var car = Car.findOne({
    serial_id: serialId
  });
  return car.bad_comments ? car.bad_comments.split('|') : [];
});
