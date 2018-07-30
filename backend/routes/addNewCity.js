/**
 * Created by liyanxiang on 2017/7/31.
 */
var router = require('koa-router')();
var low = require('lowdb');

router.prefix('/addNewCity');

function getIP() {
    var ip = '219.216.185.72';
    /* 其他城市IP地址
     ip = '56.36.32.231';   // 用户1
     ip = '124.45.244.12';   // 用户2
     ip = '65.36.123.27';   // 用户3
     ip = '76.25.107.206';  // 用户4
     */
    return ip;
}

router.post('/', function *() {
    var db = low('cityId.json');
    var city = this.req.body;
    var ip = getIP();
});

module.exports = router;