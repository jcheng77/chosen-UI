Template.selector.helpers({
  priceItems: function() {
    return [{
      high: 10
    }, {
      low: 10,
      high: 20
    }, {
      low: 20,
      high: 30
    }, {
      low: 30,
      high: 50
    }, {
      low: 50
    }];
  },
  lowerThan: function() {
    if(!this.low && this.high) {
      return true;
    } else {
      return false;
    }
  },
  higherThan: function() {
    if(!this.high && this.low) {
      return true;
    } else {
      return false;
    }
  },
  categories: function() {
    var categories = [{
      title: '空间',
      desc: '空间宽敞',
      image: '/images/cats/big_room.png'
    }, {
      title: '动力',
      desc: '动力充沛',
      image: '/images/cats/horse.png'
    }, {
      title: '操控',
      desc: '操控出色',
      image: '/images/cats/drive.png'
    }, {
      title: '舒适性',
      desc: '舒适性好',
      image: '/images/cats/comfort.png'
    }, {
      title: '外观',
      desc: '外观出众',
      image: '/images/cats/outstanding.png'
    }, {
      title: '内饰',
      desc: '内饰豪华',
      image: '/images/cats/interior.png'
    }, {
      title: '省油',
      desc: '省油经济',
      image: '/images/cats/ecom.png'
    }, {
      title: '安全性',
      desc: '安全性好',
      image: '/images/cats/security.png'
    }];
    _(categories).each(function(cat) {
      cat.selected = new ReactiveVar(false);
    });
    return categories
  },
  isSelected: function() {
    return this.selected && this.selected.get();
  }
});
Template.selector.events({
  'click .category-item': function() {
    this.selected.set(!this.selected.get());
  }
})
