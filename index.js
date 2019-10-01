var express = require("express");
var path = require("path");
var app = express();

console.log("start webserver ...");

app.use(express.static(path.join(process.cwd() + "/hotUpdate")));
app.listen(80);

