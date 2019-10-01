var net = require("net");
var tcppkg = require("../netbus/tcppkg");
var proto_man = require("../netbus/proto_man");

var sock = net.connect({
    port: 6081,
    host: "127.0.0.1",
}, function(){
    console.log("connected to server ...");
});

sock.on("connect", function(){
    console.log("session connect success");
    
    // var buf_set = tcppkg.test_pkg_two_slice("Bla", "ke");
    // sock.write(buf_set[0]);
    // setTimeout(function(){
    //     sock.write(buf_set[1]);
    // }, 5000);

    var p = proto_man.encode_cmd(proto_man.PROTO_JSON, 1, 1, "HelloWorld !");
    var new_data = tcppkg.package_data(p);
    sock.write(new_data);
});

sock.on("data", function(data){
    console.log("session receive data = ", data.toString());
})

sock.on("close", function(){
    console.log("session close");
});

sock.on("error", function(err){
    console.log("session error", err);
});

sock.on("end", function(){
    console.log("session end");
});