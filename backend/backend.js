/**
 * Created by liyanxiang on 2017/7/29.
 */
var koa = require('koa');
var app = koa();

app.use(function *() {
    this.body = 'hello world.';
});

app.listen(3000);