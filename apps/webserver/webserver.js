var express = require("express");
var path = require("path");
var app = express();
var log = require("../../utils/log");

log.info("start webserver ...");
app.use(express.static(path.join(process.cwd() + "/www_root")));
app.listen(8080);

app.get("/login", function(req, res){
    console.log(req.query);

    res.send("SUCCESS !!!");
})