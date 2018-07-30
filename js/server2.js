/**
 * Created by liyanxiang on 2017/7/24.
 */
var http = require('http');

http.createServer(function (req, res) {
    res.write('this is server No.2');
    res.end();
}).listen(9999);