Template.tops.helpers({
  tops: function() {
    var tops = Car.find().fetch();
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
  }
});
