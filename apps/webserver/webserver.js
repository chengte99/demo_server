var fs = require("fs");
var express = require("express");
var path = require("path");
var app = express();
var log = require("../../utils/log");
var game_config = require("../game_config");

var host = game_config.webserver_config.host;
var port = game_config.webserver_config.port;

if(fs.existsSync("www_root")){
    app.use(express.static(path.join(process.cwd() + "/www_root")));
}else{
    log.warn("www_root isn't exist ");
}
app.listen(port);
console.log("webserver started at " + host + ":" + port);

app.get("/server_info", function(request, response){
    var data = {
        host: game_config.GATEWAY_CONNECT_IP,
        // host: game_config.gateway_config.host, // 本機端
        tcp_port: game_config.gateway_config.ports[0],
        ws_port: game_config.gateway_config.ports[1],
    }

    var str_json = JSON.stringify(data);
    response.send(str_json);
});