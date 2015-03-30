Template.car_item.helpers({
  thumbImageUrl: function() {
    var car = this;
    if (car.hd_pics && car.hd_pics.length) {
      return car.hd_pics[0];
    } else {
      return "http://data.auto.qq.com/" + car.serial_pic;
    }
  }
});
Template.car_item.onRendered(function() {
  this.$('.car-image img').lazyLoadXT();
  Meteor.setTimeout(function() {$(window).trigger('scroll');}, 2000);
});