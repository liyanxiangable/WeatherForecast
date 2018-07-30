/**
 * Created by liyanxiang on 2017/7/29.
 */
var router = require('koa-router')();
var request = require('koa-request');
var low = require('lowdb');

var db = low('cityId.json');

router.prefix('/currentCity');

/*
function getIP() {
    var ip1 = '219.216.185.72';
    // 其他城市IP地址
    var ip2 = '39.64.159.201';   // 济南
    var ip3 = '27.221.19.202';   // 青岛
    var ip4 = '59.69.207.255';   // 郑州
    var ip5 = '14.197.199.124';  // 北京
    return ip;
}
*/

function getIP() {
    var ip1 = '219.216.185.72';
    // 其他城市IP地址
    var ip2 = '56.36.32.231';   // 用户1
    var ip3 = '124.45.244.12';   // 用户2
    var ip4 = '65.36.123.27';   // 用户3
    var ip5 = '76.25.107.206';  // 用户4
    return ip1;
}

router.get('/', function *() {

    /* 本地调试暂时不用
    // 获取IP地址
    var ip = this.request.ip;
    // 查询地理位置
    */
    var ip = getIP();
    var option = {
        url: 'http://ip.taobao.com/service/getIpInfo.php?ip=' + ip,
        headers: {
            'User-Agent': 'request',
        },
    };

    var cityList = []
    var user = db.get('user').find({userIP: ip}).value();
    if (typeof user !== 'undefined') {
        cityList = user.city;
    }
    console.log(cityList);

    var addressResponse = yield request(option);
    addressData = addressResponse.body;
    console.log(addressData);

    this.body = {city: cityList, address: addressData};
});

module.exports = router;