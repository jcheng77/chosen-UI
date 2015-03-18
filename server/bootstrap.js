AutoCon = new Mongo.Collection('auto_con');

// 服务器启动时从静态文件更新数据库
Meteor.startup(function() {
  function initData() {
    var cars = JSON.parse(Assets.getText('cars.json'));
    _(cars).each(function(car) {
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
        AutoCon.upsert({
          serial_id: sid
        }, {
          serial_id: sid,
          con: koubei.koubei_con,
          rival: koubei.koubei_rival,
          font_score: koubei.font_score
        });
      }
    });
    delete auto_con;
    delete data;
  }
  Meteor.setTimeout(function() {
    var before = new Date();
    initData();
    var after = new Date();
    console.log('Data loaded in', (after.getTime() - before.getTime())/1000, 'seconds');
  }, 0);
});