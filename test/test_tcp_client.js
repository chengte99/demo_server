var net = require("net");
var tcppkg = require("../netbus/tcppkg");

var sock = net.connect({
    port: 6080,
    host: "127.0.0.1",
}, function(){
    console.log("connected to server ...");
});

sock.on("connect", function(){
    console.log("session connect success");
    
    var buf_set = tcppkg.test_pkg_two_slice("Bla", "ke");
    sock.write(buf_set[0]);
    setTimeout(function(){
        sock.write(buf_set[1]);
    }, 5000);

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