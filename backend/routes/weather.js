/**
 * Created by liyanxiang on 2017/7/29.
 */
var router = require('koa-router')();
var request = require('koa-request');
var low = require('lowdb');

router.prefix('/weather');

/*
function getWeather() {
    var option = {
        url: 'http://aider.meizu.com/app/weather/listWeather?cityIds=101070201',
        headers: {
            'User-Agent': 'request',
        },
    };
    var response = yield request(option);
    console.log(response.body);

    return response.body
}
*/

router.get('/', function *() {
    var cityParam = this.query;
    var db = low('cityId.json');
    var cityItem = db.get('city').find({countyname: cityParam.city}).value();
    var cityCode = cityItem.areaid;

    var option = {
        url: 'http://aider.meizu.com/app/weather/listWeather?cityIds=' + cityCode,
        headers: {
            'User-Agent': 'request',
        },
    };
    var weatherResponse = yield request(option);
    weatherData = weatherResponse.body;
    //console.log(weatherData);

    this.body = weatherData;
});

module.exports = router;