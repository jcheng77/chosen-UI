Template.recommends.helpers({
  recommends: function() {
    return Session.get('recommends') || [];
  }
});