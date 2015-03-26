Template.dir_list.onCreated(function() {
  this.dirs = [{
    dir_name: '商务',
    title: '商务人士',
    desc: '稳重 大气',
    image: '/images/dirs/business.png'
  }, {
    dir_name: '家用',
    title: '家庭用车',
    desc: '舒适 实用',
    image: '/images/dirs/family.png'
  }, {
    dir_name: '时尚',
    title: '单身贵族',
    desc: '个性 时尚',
    image: '/images/dirs/single.png'
  }, {
    dir_name: '男性',
    title: '时尚男性',
    desc: '帅气迷人',
    image: '/images/dirs/bigguy.png'
  }, {
    dir_name: '女性',
    title: '时尚女性',
    desc: '颜值爆表',
    image: '/images/dirs/women.png'
  }, {
    dir_name: '代步',
    title: '代步一族',
    desc: '实惠实用',
    image: '/images/dirs/commute.png'
  }, {
    dir_name: '运动',
    title: '自由操控',
    desc: '动感十足',
    image: '/images/dirs/drive-free.png'
  }, {
    dir_name: '越野',
    title: '休闲越野',
    desc: '动感十足',
    image: '/images/dirs/leisure.png'
  }];
})
Template.dir_list.helpers({
  dirs: function() {
    return Template.instance().dirs;
  }
});
Template.dir_list_result.helpers({
  cars: function() {
    return Car.find();
  }
});
