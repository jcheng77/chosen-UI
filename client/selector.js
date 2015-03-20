Template.selector.onCreated(function() {
  //初始化选项数据
  this.prices = [{
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
  _(this.prices).each(function(price) {
    price.selected = new ReactiveVar(false);
  });
  this.categories = [{
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
    title: '油耗',
    desc: '省油经济',
    image: '/images/cats/ecom.png'
  }, {
    title: '性价比',
    desc: '性价比好',
    image: '/images/cats/security.png'
  }];
  _(this.categories).each(function(cat) {
    cat.selected = new ReactiveVar(false);
  });
  //当前选中数据
  this.selectedPrice = new ReactiveVar(null);
  this.selectedCats = new ReactiveVar([]);
  this.go = new ReactiveVar(false);
  this.resultLoading = new ReactiveVar(false);

  var that = this;
  this.autorun(function() {
    var selectedCats = that.selectedCats.get();
    if(selectedCats.length === 3) {
      that.go.set(true);
      that.resultLoading.set(true);
      that.sub = that.subscribe('filtered_cars', that.selectedPrice.get(), that.selectedCats.get(), {
        onReady: function() {
          that.resultLoading.set(false);
        }
      });
    }
  });
});

Template.selector.onRendered(function() {
  // this.$('#selector-result').css('transform', 'translate(0,-' + this.$('#selector').height() +'px)');
});

Template.selector.helpers({
  priceItems: function() {
    return Template.instance().prices;
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
    return Template.instance().categories
  },
  isCatSelected: function() {
    return this.selected && this.selected.get();
  },
  isPriceSelected: function() {
    return this.selected && this.selected.get();
  },
  isGo: function() {
    var goVar = Template.instance().go;
    return goVar && goVar.get();
  },
  isLoading: function() {
    return Template.instance().resultLoading.get();
  },
  results: function() {
    var cars = Car.find({}).fetch();
    var selectedPrice = Template.instance().selectedPrice.get();
    if(selectedPrice) {
      cars = _(cars).filter(function(car) {
        var low = parseFloat(car.serial_low_price);
        var high = parseFloat(car.serial_high_price);
        if(selectedPrice.low && selectedPrice.high) {
          return selectedPrice.low < low && selectedPrice.high > high;
        } else if(selectedPrice.low) {
          return low >= selectedPrice.low;
        } else {
          return high <= selectedPrice.high;
        }
      });
    }
    return cars;
  }
});
Template.selector.events({
  'click .category-item': function() {
    this.selected.set(!this.selected.get());
    var selectedVar = Template.instance().selectedCats;
    var selectedCats = selectedVar.get();
    if(this.selected.get()) {
      selectedCats.push(this);
    } else {
      var that = this;
      selectedCats = _(selectedCats).reject(function(cat) {
        return(cat === that);
      });
    }
    selectedVar.set(selectedCats);
  },
  'click .price-item': function() {
    this.selected.set(!this.selected.get());
    var selectedVar = Template.instance().selectedPrice;
    var current = selectedVar.get();
    if(current && current !== this) {
      current.selected.set(false);
    }
    selectedVar.set(this);
  },
  'click #re-chooser': function() {
    Template.instance().go.set(false);
  }
});
