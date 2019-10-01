var ws = require("ws");
var proto_man = require("../netbus/proto_man");

var sock = new ws("ws://127.0.0.1:6083");

sock.on("open", function(){
    console.log("connect success !");

    // sock.send("HelloWorld1");
    // sock.send("HelloWorld2");
    // sock.send("HelloWorld3");
    // sock.send(Buffer.alloc(10));

    var data = {
        uname: "大凱文",
        upwd: "asd123",
    };

    var cmd_buf = proto_man.encode_cmd(proto_man.PROTO_JSON, 1, 1, data);
    sock.send(cmd_buf);
});

sock.on("error", function(err){
    console.log("session error ...", err);
});

sock.on("close", function(){
    console.log("session close ...");
});

sock.on("message", function(data){
    console.log("session receive data ...", data.toString());
})