// 服务器启动时从静态文件更新数据库
Meteor.startup(function() {
  function initData() {
    var cars = JSON.parse(Assets.getText('json/cars-new.json'));
    _(cars).each(function(car) {
      delete car._id;
      Car.upsert({
        serial_id: car.serial_id
      }, car);
    });
    delete cars;

    var auto_con = JSON.parse(Assets.getText('json/autohome_con_data.json'));
    var id_matches = JSON.parse(Assets.getText('json/match.json'));
    var data = _(auto_con).filter(function(auto) {
      return auto.font_score !== '';
    });
    _(data).each(function(koubei) {
      var matchedId = _(id_matches).find(function(match) {
        return match.aSId === koubei.sid && match.tSId !== '-1';
      });
      if (matchedId) {
        var sid = parseInt(matchedId.tSId, 10);
        var con = _(koubei.koubei_con).map(function(item) {
          return {
            rank: parseFloat(item.rank.substring(0, 5), 10),
            title: item.title.substring(0, item.title.length -1)
          }
        });
        var score = parseInt(koubei.font_score, 10);
        AutoCon.upsert({
          serial_id: sid
        }, {
          serial_id: sid,
          name: koubei.name,
          con: con,
          font_score: score
        });
      }
    });
    delete auto_con;
    delete data;
  }
  if (false) {
  Meteor.setTimeout(function() {
    var before = new Date();
    initData();
    var after = new Date();
    console.log('Data loaded in', (after.getTime() - before.getTime())/1000, 'seconds');
  }, 0);
  }
});