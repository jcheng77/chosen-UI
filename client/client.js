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
  },
  goodComments: function() {
    var car = Car.findOne({
      serial_id: Session.get('serial_id')
    });
    return car.good_comments.split('|');
  },
  badComments: function() {
    var car = Car.findOne({
      serial_id: Session.get('serial_id')
    });
    return car.bad_comments.split('|');
  },
  jsApiReady: function() {
    return Session.get('wxJsApiReady');
  }
});

Template.main.events({
  'click .image': function(e, t) {
    var labelsView = FView.byId('labels');
    if(labelVisbile) {
      labelsView.modifier.setOpacity(0, {
        curve: 'easeOut',
        duration: 1000
      }, function() {
        labelsView.modifier.setTransform(famous.core.Transform.translate(20, 50, 0));
      });
    } else {
      labelsView.modifier.setOpacity(1, {
        curve: 'easeOut',
        duration: 200
      }, function() {
        labelsView.modifier.setTransform(famous.core.Transform.translate(20, 50, 1000));
      });
    }
    labelVisbile = !labelVisbile;
  },
  'click .ico-share': function(e, t) {
    var car = Car.findOne({
      serial_id: Session.get('serial_id')
    });
    wx && wx.onMenuShareTimeline({
      title: car.serial_name, // 分享标题
      link: Router.current().originalUrl, // 分享链接
      imgUrl: 'http://data.auto.qq.com/'+ car.serial_pic, // 分享图标
      success: function () {
        alert('test')

        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        alert('test!')

        // 用户取消分享后执行的回调函数
      }
    });
  }
});