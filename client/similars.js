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

function handleBackClicked(e) {
  Router.go('car.comments', {
    serial_id: Session.get('serial_id')
  });
}

function handleCarClicked(e) {
  Router.go('car.comments', {
    serial_id: this.serial_id
  });
}
Template.similars.events({
  'click .back-link': handleBackClicked,
  'click .car-item': handleCarClicked
});
