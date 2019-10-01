var http = require("http");

//callback = (is_ok, data)
function http_get(host, port, path, params, callback){
    var option = {
        host: host,
        port: port,
        path: path + "?" + params,
        method: "GET",
    }

    var req = http.request(option, function(incoming_msg){
        console.log("incoming_msg statusCode: ", incoming_msg.statusCode);

        incoming_msg.on("data", function(data){
            if(incoming_msg.statusCode == 200){
                callback(true, data);
            }
        })
    });

    req.end();
}

http_get("127.0.0.1", 8080, "/login", "uname=kevin&upwd=asd123", function(is_ok, data){
    if(is_ok){
        console.log("response: ", data.toString());
    }
})

