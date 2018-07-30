/**
 * Created by liyanxiang on 2017/7/31.
 */
var request = require('request');
var router = require('koa-router')();
var low = require('lowdb');

router.prefix('/addCity');
var db = low('cityId.json');

router.post('/', function *() {
    var input = this.request.body;
    console.log(input);
    var searchCity = db.get('city').find({countyname: input.value}).value();
    console.log(searchCity);
    this.body = searchCity;
});

router.post('/confirm', function *() {
    var city = this.request.body;
    console.log(city);
    console.log(city.name);
    var ip = '' + getIP();
    /*
    var temp = ip.split('.');
    var id = '';
    for (var i = 0; i < temp.length; i++) {
        id += temp[i];
    }
    //id = Number(id);
    */
    var searchIP = db.get('user').find({userIP: ip}).value();
    console.log(searchIP);

    if (typeof searchIP === 'undefined') {
        var newUser = {
            //id: id,
            userIP: ip,
            city: [city.name],
        };
        console.log('\n\n--------------------------');
        console.log(newUser);
        console.log('--------------------------\n\n');
        db.get('user').push(newUser).write();
        //db.set('user').insert(newUser);
    } else {
        var oldRecord = db.get('user').find({userIP: ip}).value();
        console.log(oldRecord);
        var duplicated = false;
        for (var i = 0; i < oldRecord.city.length; i++) {
            if (oldRecord.city[i] === city.name) {
                duplicated = true;
                break;
            }
        }
        if (!duplicated) {
            oldRecord.city.push(city.name);
            var newRecord = {
                //id: oldRecord.id,
                userIP: oldRecord.userIP,
                city: oldRecord.city,
            };
            console.log(newRecord);
            db.get('user').remove({userIP: ip}).write();
            db.get('user').push(newRecord).write();
        }
    }
});

function getIP() {
    var ip1 = '219.216.185.72';
    // 其他城市IP地址
    var ip2 = '56.36.32.231';   // 用户1
    var ip3 = '124.45.244.12';   // 用户2
    var ip4 = '65.36.123.27';   // 用户3
    var ip5 = '76.25.107.206';  // 用户4
    return ip1;
}

module.exports = router;