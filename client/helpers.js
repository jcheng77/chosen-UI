Template.registerHelper('goodComments', function() {
  var car = this;
  return car.good_comments ? car.good_comments.split('|') : [];
});
Template.registerHelper('badComments', function() {
  var car = this;
  return car.bad_comments ? car.bad_comments.split('|') : [];
});
Template.registerHelper('notBadData', function() {
  var car = this;
  return car && car.good_comments;
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
