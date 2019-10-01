var ws = require("ws");

var sock = new ws("ws://127.0.0.1:6081");

sock.on("open", function(){
    console.log("connect success !");

    sock.send("HelloWorld1");
    sock.send("HelloWorld2");
    sock.send("HelloWorld3");

    sock.send(Buffer.alloc(10));
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