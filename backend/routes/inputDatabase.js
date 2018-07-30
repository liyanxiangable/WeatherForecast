/**
 * Created by liyanxiang on 2017/7/30.
 */
var router = require('koa-router')();
var low = require('lowdb');
var fs = require('fs');

router.prefix('/inputDatabase');

router.get('/', function *() {
    var str = fs.readFileSync('../cityList.json', {
        encoding: 'utf-8',
    });
    var cityList = JSON.parse(str);
    console.log(cityList);
    this.body = str;
    //console.log(str);

    var db = low('cityId.json');
    db.defaults({city: [], user: []}).write();

    for (var i = 0; i < cityList.length; i++) {
        db.get('city').push(cityList[i]).write();
    }
});

module.exports = router;