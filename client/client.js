var labels = ['外形酷炫', '帅到没朋友', '价格太虚高', '地盘太低', '中控有科技'];
var labelVisbile = true;

Template.main.helpers({
  car: function() {
    return Car.findOne({
      serial_id: Session.get('serial_id')
    });
  },
  labels: function() {
    return labels;
  },
  isCurrentIndex: function(imageUrl) {
    var car = Car.findOne({
      serial_id: Session.get('serial_id')
    });
    var imageIndex = car.hd_pics.indexOf(imageUrl)
    var fview = FView.byId("images");
    var current = fview.properties.get('index');
    return current === imageIndex;
  },
  avatarNumber: function() {
    return Math.ceil(Math.random() * 12);
  }
});

Template.main.events({
  'click .image': function(e, t) {
    var labelsView = FView.byId('labels');
    if(labelVisbile) {
      labelsView.modifier.setOpacity(0, {
        curve: 'easeOut',
        duration: 1000
      });
    } else {
      labelsView.modifier.setOpacity(1, {
        curve: 'easeOut',
        duration: 1000
      });
    }
    labelVisbile = !labelVisbile;
  }
});
