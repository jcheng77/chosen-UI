Template.similars.helpers({
  serialId: function() {
    return Session.get('serial_id');
  },
  similarCars: function() {
    var serialId = Session.get('serial_id');// current car
    // all publish cars except for current should be the similar ones, check out publish function in server side
    return Car.find({
      serial_id: {$ne : serialId}
    });
  }
});