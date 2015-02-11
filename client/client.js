var labelVisbile = true;

function gen3Numbers(biggest) {
  var numbers = [];
  while(numbers.length < 3) {
    var newNr = (parseInt(Math.random() * biggest)) + 1;
    if(numbers.indexOf(newNr) == -1) {
      numbers.push(newNr);
    }
  }
  return numbers;
}

Template.main.helpers({
  car: function() {
    return Car.findOne({
      serial_id: Session.get('serial_id')
    });
  },
  labels: function(number) {
    var car = Car.findOne({
      serial_id: Session.get('serial_id')
    });

    if (car && number) {
      return car.labels.splice(0, number);
    } else {
      return car.labels;
    }
  },
  labelLength: function(label) {
    var length = label.length;
    if (length < 4) {
      length = 4;
    } else if (length > 11) {
      length = 11;
    }
    return length;
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
  avatarNumbers: function() {
    return gen3Numbers(11);
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
