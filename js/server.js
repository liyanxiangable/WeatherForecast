/**
 * Created by liyanxiang on 2017/7/22.
 */
var express = require('express');
var app = express();
//app.use(express.static('public'));
app.get('/', function (req, res) {
    res.send('新垣结衣的微笑就由我来守护');
});
app.listen(8888);
/*
http.createServer(function(request, response) {

    response.writeHead(200, {"Content-Type": "text/plain"});

    response.write("Hello World");

    response.end();

}).listen(8888);
*/