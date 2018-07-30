/**
 * Created by liyanxiang on 2017/7/18.
 */

var addCity = document.getElementById('find-city');
var closeAlternative = document.getElementById('closeAlternative');
var alternativeItem = document.getElementsByClassName('alternativeItem');
var closeImg = document.getElementById('closeImg');
var todayDateDiv = document.getElementById('todayDate');
var alternativeDiv = document.getElementById('alternative');
var forecastItem = document.getElementsByClassName('forecastItem');
var body = document.getElementsByTagName('body')[0];


console.log(forecastItem);
console.log(alternativeItem);

var echarts = echarts.init(document.getElementById('detailData'));

function showCityList(event) {
    createInputCity();
    event.preventDefault();
    document.getElementById('find-city').style.display = 'none';
    document.getElementById('original').style.display = 'none';
    alternativeDiv.style.display = 'block';
}

function createInputCity() {
    var inputCity = document.createElement('input');
    inputCity.setAttribute('id', 'inputCity');
    inputCity.setAttribute('type', 'text');
    inputCity.setAttribute('placeholder', '搜索城市');
    inputCity.onfocus = startInput;
    alternativeDiv.insertBefore(inputCity, alternativeDiv.firstElementChild);
}

function addNewCity() {
    var city = this.innerHTML;

    requestAddNewCity(city);
    var weather = getCityWeather(city);
    showCityWeather(weather);
}

function requestAddNewCity(city) {
    var url = 'http://localhost:3000/addCity/confirm';
    var data = {name: city};
    var jsonData = JSON.stringify(data);
    console.log(jsonData);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, false);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200|| xhr.status === 304) {
            console.log(xhr.response);
        }
    };
    xhr.send(jsonData);
}

function closeAlternativeDiv() {
    var foundCityDiv = document.getElementById('foundCity');
    if (foundCityDiv) {
        foundCityDiv.parentNode.removeChild(foundCityDiv);
    }
    alternativeDiv.style.display = 'none';
    document.getElementById('find-city').style.display = 'block';
    document.getElementById('original').style.display = 'block';
    alternativeDiv.removeChild(document.getElementById('inputCity'));
}

function init() {
    // 根据当前IP地址获取当前的城市。
    var userData = getCurrentCity();
    var currentCityData = JSON.parse(userData.address).data;
    var cityList = userData.city;
    showCurrentCity(currentCityData);

    // 使用lowdb获取当前已经添加的城市列表
    // getExistingCities();
    showExistingCities(cityList);

    // 获取当前公历、农历日期等
    getToday();
    showToday();

    // 获取默认当前城市的天气
    var currentCity = currentCityData.city;
    var weather = getCityWeather(currentCity);
    changeBackgroundImage(weather.realtime.weather);
    showCityWeather(weather);
}

function showExistingCities(cityList) {
    var div = document.getElementById('more-cities').children[0];
    console.log(div);
    for (var i = 0; i < cityList.length; i++) {
        var cityItem = document.createElement('li');
        cityItem.setAttribute('class', 'more-city clickable');
        cityItem.innerHTML = cityList[i];
        console.log(cityItem);
        cityItem.onclick = selectCity;
        div.appendChild(cityItem);
    }
}

function selectCity() {
    console.log(this);
    var city = this.innerHTML;
    var weather = getCityWeather(city);
    showCityWeather(weather);
}

function getCurrentCity() {
    var url = 'http://localhost:3000/currentCity';
    var sumData;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 304) {
            sumData = JSON.parse(xhr.responseText);
            console.log(sumData);
        }
    };
    xhr.send();
    //return address.data;
    return sumData;
}

function showCurrentCity(currentCityData) {
    console.log(currentCityData);
    document.getElementById('current-city').innerHTML = currentCityData.city;
}

function getToday() {
    // 首先获取当前日期
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    todayData = calendar.solar2lunar(year, month, day);
    console.log(todayData);
}

function showToday() {
    todayDateDiv.innerHTML = '';
    var todayDateDom = document.createElement('p');
    todayDateDom.innerHTML = todayData.cYear + '年' + (todayData.cMonth + 1) + '月' + todayData.cDay + '日' +
        '\t' + todayData.ncWeek + '\t' + todayData.gzYear + '年' + todayData.IMonthCn + todayData.IDayCn;
    todayDateDom.setAttribute('class', 'date');
    todayDateDiv.appendChild(todayDateDom);
}

function getCityWeather(city) {
    console.log("我已经进来了");
    // 首先是获得url
    //var url = getRequestURL(city);
    var postfix = city;
    if (city[city.length - 1] === '市'){
        postfix = city.slice(0, -1)
    }
    console.log(postfix);
    //var url = 'http://localhost:3000/weather/cityId?city=' + city.slice(0, -1);
    var url = 'http://localhost:3000/weather?city=' + postfix;
    var weather;
    /*
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8080/gakki',
        async: false,
        success: function (data) {
            console.log(data.value[0]);
            weather = data.value[0];
        }
    });
*/

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 304) {
            weather = JSON.parse(xhr.responseText);
            weather = weather.value[0];
        }
    };
    xhr.send();

    console.log(weather);
    return weather;
}

function showCityWeather(weather) {
    var pm25 = weather.pm25;
    var realtime = weather.realtime;
    var forecast = weather.weathers;
    var detailByHours = weather.weatherDetailsInfo.weather3HoursDetailsInfos;
    showAirQuality(pm25);
    showForecast(realtime, forecast);
    showDetail(detailByHours);
}

function showAirQuality(pm25) {
    var todayAirQualityDiv = document.getElementById('todayAirQuality');
    todayAirQualityDiv.innerHTML = '';
    var airQuality = document.createElement('p');
    airQuality.setAttribute('class', 'airQuality');
    var qualityScale;
    if (pm25.quality === '优') {
        qualityScale = 'greatQualityIcon';
    } else if (pm25.quality === '良') {
        qualityScale = 'goodQualityIcon';
    } else {
        qualityScale = 'badQualityIcon';
    }
    airQuality.innerHTML = '空气质量指数 ' + pm25.aqi +
        '  <span class="'+ qualityScale + ' qualityIcon">' + pm25.quality + '</span>';
    todayAirQualityDiv.appendChild(airQuality);
}

function showForecast(realtime, forecast) {
    showTodayWeather(realtime, forecast[0]);
    showWeekWeather(forecast);
}

function showTodayWeather(realtime, todayWeather) {
    console.log(realtime);
    var picDiv = document.getElementById('actualPicture');
    var commonDiv = document.getElementById('todayTemperature');
    var actualLeftDiv = document.getElementById('actualTemperature');
    var actualRightUpDiv = document.getElementById('actualRightUp');
    var actualRightDownDiv = document.getElementById('actualRightDown');
    var height = actualLeftDiv.clientHeight;
    console.log(height);
    actualLeftDiv.style.fontSize = height * 0.9 + 'px';
    actualLeftDiv.style.lineHeight = height + 'px';
    actualRightUpDiv.style.lineHeight = height / 2 + 'px';
    actualRightDownDiv.style.lineHeight = height / 2 + 'px';
    // 显示天气图标
    showWeatherIcon(picDiv, realtime.weather);
    // 显示风度区间、风力等天气状况
    showSummaryWeather(commonDiv, todayWeather);
    // 显示其他信息
    actualLeftDiv.innerHTML = realtime.temp;
    actualRightUpDiv.innerHTML = '&#8451';
    actualRightDownDiv.innerHTML = realtime.weather;

}

function showWeekWeather(forecast) {
    console.log(forecast);

    var forecastList = document.getElementById('forecast').firstElementChild.getElementsByTagName('li');
    console.log(forecastList['tian']);
    for (var i = 0; i < forecastList.length; i++) {
        // 显示天气图标
        var index = i + 1;
        showWeatherIcon(forecastList[i].getElementsByClassName('forecastPic')[0], forecast[index].weather);
        // 显示风度区间、风力等天气状况
        showSummaryWeather(forecastList[i].getElementsByClassName('commonWeatherItem')[0], forecast[index]);

        // 显示其他信息
        var containerDiv = forecastList[i].getElementsByClassName('forecastDate')[0];
        containerDiv.innerHTML = '';
        weekdaySpan = document.createElement('div');
        dateSpan = document.createElement('div');
        weekdaySpan.innerHTML = forecast[index].week;
        var formatDate = forecast[index].date.split('-');
        var month = Number(formatDate[1]);
        var day = Number(formatDate[2]);
        dateSpan.innerHTML = month + '月' + day + '日';
        var height = containerDiv.clientHeight / 2;
        weekdaySpan.setAttribute('class', 'weekdaySpan');
        weekdaySpan.setAttribute('style', 'line-height:' + height + 'px');
        dateSpan.setAttribute('class', 'dateSpan');
        dateSpan.setAttribute('style', 'line-height:' + height + 'px');
        containerDiv.appendChild(weekdaySpan);
        containerDiv.appendChild(dateSpan);
    }
}

function showWeatherIcon(div, weather) {
    console.log(weather);
    div.innerHTML = '';
    var img = document.createElement('img');
    var weatherPicUrl = '../images/';
    //var backgroundImage = '/EATS/background/';
    switch(weather) {
        case '晴':
            weatherPicUrl += '晴.png';
            //backgroundImage = 'bright.jpg';
            break;
        case '少云':
            weatherPicUrl += '少云.png';
            //backgroundImage += 'bright.jpg';
            break;
        case '多云':
            weatherPicUrl += '多云.png';
            //backgroundImage += 'darkblue.jpg';
            break;
        case '阴':
            weatherPicUrl += '阴.png';
            //backgroundImage += 'grey.jpg';
            break;
        case '小雨':
            weatherPicUrl += '小雨.png';
            //backgroundImage += 'darkblue.jpg';
            break;
        case '中雨':
            weatherPicUrl += '中雨.png';
            //backgroundImage += 'deepblue.jpg';
            break;
        case '大雨':
            weatherPicUrl += '大雨.png';
            //backgroundImage += 'deepblue.jpg';
            break;
        case '雷阵雨':
            weatherPicUrl += '雷阵雨.png';
            break;
        case '阵雨':
            weatherPicUrl += '阵雨.png';
            break;
        default:
            weatherPicUrl += '未知.png';
            break;
    }
    img.setAttribute('class', 'weatherImg');
    img.setAttribute('src', weatherPicUrl);
    //body.style.backgroundImage = 'url("' + backgroundImage + '")';
    //console.log(backgroundImage);
    //body.style.backgroundImage = 'url("/EATS/background/bright.jpg")';
    div.appendChild(img);
}

function showSummaryWeather(div, forecast) {
    console.log(div);
    console.log(forecast);

    var rangeDiv = div.getElementsByClassName('temperatureRange')[0];
    var kindDiv = div.getElementsByClassName('weatherKind')[0];


    rangeDiv.innerHTML = forecast.temp_night_c + ' - ' + forecast.temp_day_c + '<br>';
    kindDiv.innerHTML = forecast.weather;
    var height = rangeDiv.clientHeight;
    rangeDiv.style.lineHeight = height + 'px';
    kindDiv.setAttribute('style', 'line-height:' + height + 'px');
}

function showDetail(detailByHour) {
    console.log(detailByHour);
    // 显示今天详细的天气数据
    showTemperatureByHour(detailByHour);
}

function showTemperatureByHour(detailByHour) {
    var time = [];
    var temperature = [];
    for (var i = 0; i < detailByHour.length; i++) {
        hour = detailByHour[i].startTime.toString().split(' ')[1].split(':')[0] + '点';
        average = detailByHour[i].highestTemperature / 2 + detailByHour[i].lowerestTemperature / 2;
        time.push(hour);
        temperature.push(average);
    }
    time[0] = '现在';
    var maxTemperature = Math.max.apply(null, temperature) + 2;
    var minTemperature = Math.min.apply(null, temperature) - 2;
    //var scale = 4;
    var splitNumber = 4;
    //var echarts = echarts.init(document.getElementById('detailData'));
    var option = {
        /*
        title: {
            text: '新垣结衣的天气预报',
            textStyle: {
                color: '#dddddd',
            },
        },
        */
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: time,
            axisLine: {
                lineStyle: {
                    color: '#dddddd',
                },
            },
            axisLabel: {
                textStyle: {
                    color: '#dddddd',
                },
            },
        },
        yAxis: {
            type: 'value',
            max: maxTemperature,
            min: minTemperature,
            splitNumber: splitNumber,
            //scale: scale,
            minInterval: 1,
            axisLabel: {
                formatter: '{value} °C'
            },
            axisLine: {
                lineStyle: {
                    color: '#dddddd',
                },
            },
        },
        color: ['#eeeeee'],
        //legend: {
        //    data: ['最高温度'],
        //},
        grid: {
            left: '3%',
            right: '3%',
            top: '10%',
            bottom: '3%',
            containLabel: true,
            backgroundColor: 'rgba(240, 240, 240, 0.2)',
            show: true,
            borderColor: '#dddddd',
        },
        series: [
            {
                name: '实时温度',
                type: 'line',
                data: temperature,
                smooth: true,
            },
        ]
    };
    echarts.setOption(option);
}

function getRequestURL(city) {
    // 暂时写死。以大连：101070201为例
    city.id = '101070201';
    city.name = 'dalian';
    var url = 'http://aider.meizu.com/app/weather/listWeather?cityIds=' + city.id;
    return url;
}

function toggleBackgroundImage() {
    var weather = this.children[this.children.length - 1].lastElementChild.innerHTML;
    changeBackgroundImage(weather);
}

function resetBackgroundImage() {
    var weather = document.getElementById('actualRightDown').innerHTML;
    changeBackgroundImage(weather);
}

function changeBackgroundImage(weather) {
    var backgroundImage = '../background/';
    switch(weather) {
        case '晴':
        case '少云':
            backgroundImage += 'bright.jpg';
            break;
        case '多云':
        case '阵雨':
        case '小雨':
            backgroundImage += 'darkblue.jpg';
            break;
        case '阴':
            backgroundImage += 'grey.jpg';
            break;
        case '中雨':
        case '大雨':
        case '雷阵雨':
            backgroundImage += 'deepblue.jpg';
            break;
        default:
            break;
    }
    body.style.backgroundImage = 'url("' + backgroundImage + '")';
}

function startInput() {
    var inputCity = document.getElementById('inputCity');
    inputCity.oninput = function () {
        var inputData = {'value': inputCity.value};
        var foundCityDiv = document.getElementById('foundCity');
        if (foundCityDiv && inputData !== foundCityDiv.innerHTML) {
            foundCityDiv.parentNode.removeChild(foundCityDiv);
        }
        var JSONString = JSON.stringify(inputData);
        var keyValueString = '';
        (function(value){
            for(var key in value){
                keyValueString += key +"=" + value[key] + "&";
            };
            return keyValueString;
        })(inputData);
        //var url = 'http://localhost:3000/addCity?keyword=' + inputString;
        var url = 'http://localhost:3000/addCity';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, false);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        //xhr.setRequestHeader("Content-type","application/json;charset=utf-8");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200 || xhr.status === 304) {
                var foundCity = JSON.parse(xhr.response);
                showFoundCity(foundCity);
            }
        };
        //xhr.send(JSONString);
        xhr.send(keyValueString);
    }
}

function showFoundCity(city) {
    var foundCity = document.createElement('div');
    foundCity.innerHTML = city.countyname;
    foundCity.setAttribute('id', 'foundCity');
    foundCity.onclick = addNewCity;
    inputCity.parentNode.insertBefore(foundCity, inputCity.nextElementSibling);
}

var todayData;

addCity.onclick = showCityList;
closeImg.onclick = closeAlternativeDiv;
for (var j = 0; j < alternativeItem.length; j++) {
    alternativeItem[j].onclick = addNewCity;
}
for (var i = 0; i < forecastItem.length; i++) {
    forecastItem[i].onmouseenter = toggleBackgroundImage;
    forecastItem[i].onmouseleave = resetBackgroundImage;
}

window.onload = init;