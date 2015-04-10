Template.ticheji.helpers({
  encodedUrl: function(url) {
    return Base64.encode(url);
  }
});
Template.ticheji.events({
  'click .ticheji-item': function() {
    Router.go('car.ticheji.detail', {
      url: Base64.encode(this.url)
    });
  }
});

Template["ticheji.detail"].onCreated(function() {
  this.iframeLoading = new ReactiveVar(true);
});
Template["ticheji.detail"].onRendered(function() {
  var that = this;
  this.$('iframe').load(function() {
    that.iframeLoading.set(false);
  });
});
Template["ticheji.detail"].helpers({
  isLoading: function() {
    return Template.instance().iframeLoading.get();
  }
});