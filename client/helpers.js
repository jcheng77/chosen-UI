Template.registerHelper('goodComments', function(serialId) {
  var car = Car.findOne({
    serial_id: serialId
  });
  return car.good_comments ? car.good_comments.split('|') : [];
});
Template.registerHelper('badComments', function(serialId) {
  var car = Car.findOne({
    serial_id: serialId
  });
  return car.bad_comments ? car.bad_comments.split('|') : [];
});

isWeixinClient = function isWeixinClient() { 
  var ua = window.navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
    return true; 
  }else{ 
    return false; 
  } 
};
Template.registerHelper('isWeixinClient', isWeixinClient);
