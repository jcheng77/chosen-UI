Router.route('/car/:serial_id', {
  template: 'main',
  waitOn: function() {
    var serial_id = parseInt(this.params.serial_id, 10);
    Session.set('serial_id', serial_id);
    this.subscribe('car', serial_id);
  }
});