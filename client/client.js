Template.main.helpers({
  car: function(id) {
    return Car.findOne({id: id});
  },
  labels: function() {
    return ['a', 'b', 'c'];
  }
});
Template.images.helpers({
  current: function() {
    var fview = FView.byId("images");
    return fview.properties.get('index');
  }
});