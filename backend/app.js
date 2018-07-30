var app = require('koa')()
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , onerror = require('koa-onerror');

var server = require('koa-static');
var path = require('path');

var index = require('./routes/index');
var users = require('./routes/users');
var weather = require('./routes/weather');
var currentCity = require('./routes/currentCity');
var inputDatabase = require('./routes/inputDatabase');
var addCity = require('./routes/addCity');
var addNewCity = require('./routes/addNewCity');

// error handler
onerror(app);

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'jade'
}));
app.use(require('koa-bodyparser')({ multipart: true }));
app.use(json());
app.use(logger());

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

//app.use(require('koa-static')(__dirname + '/public'));
app.use(require('koa-static')(path.join(__dirname, '../')));

// routes definition
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(weather.routes(), weather.allowedMethods());
app.use(currentCity.routes(), currentCity.allowedMethods());
app.use(inputDatabase.routes(), inputDatabase.allowedMethods());
app.use(addCity.routes(), addCity.allowedMethods());
app.use(addNewCity.routes(), addNewCity.allowedMethods());

module.exports = app;
