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

Template.car.helpers({
  car: function() {
    return Car.findOne({
      serial_id: Session.get('serial_id')
    });
  },
  labels: function(number) {
    var car = Car.findOne({
      serial_id: Session.get('serial_id')
    });

    if(car && number) {
      return car.labels.splice(0, number);
    } else {
      return car.labels;
    }
  },
  labelLength: function(label) {
    var length = label.length;
    if(length < 4) {
      length = 4;
    } else if(length > 11) {
      length = 11;
    }
    return length;
  },
  avatarNumbers: function() {
    return gen3Numbers(11);
  },
  jsApiReady: function() {
    return Session.get('wxJsApiReady');
  },
  viewCount: function() {
    var viewCount = ViewCount.findOne({
      serial_id: Session.get('serial_id')
    });
    var count = viewCount ? viewCount.count : 0;
    return count + 50;
  },
  cutLabel: function(label) {
    if(label.length > 12) {
      return label.substring(0, 12);
    } else {
      return label;
    }
  }
});

var labelVisbile = true;

function handleImageClicked(e, t) {
  t.$('#labels').toggle();
};

function handleShareClicked(e, t) {
  t.$('#guide').show();
}

function handleGuideClicked(e, t) {
  t.$('#guide').hide();
}

function handleSimilarsClicked(e) {
  Router.go("car.similars", {
    serial_id: this.serial_id
  });
}

Template.car.events({
  'click .image': handleImageClicked,
  'click .ico-share': handleShareClicked,
  'click #guide': handleGuideClicked,
  'click #similars-link': handleSimilarsClicked
});

Template.car.rendered = function() {
  this.$("#slider").owlCarousel({
    slideSpeed: 300,
    paginationSpeed: 400,
    items: 1
  });
  $ && $(window).scrollTop(0);
};
