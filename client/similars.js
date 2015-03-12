Template.similars.helpers({
  serialId: function() {
    return Session.get('serial_id');
  },
  similarCars: function() {
    var serialId = Session.get('serial_id');
    var car = Car.findOne({
      serial_id: serialId
    });
    var similar_ids = _(car.serial_competion || []).map(function(comp) {
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
  }
});