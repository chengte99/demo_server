require("../../init");
var netbus = require("../../netbus/netbus");
var proto_man = require("../../netbus/proto_man");
var service_manager = require("../../netbus/service_manager");
var game_config = require("../game_config");

var auth_service = require("./auth_service");
var Stype = require("../Stype");

var center = game_config.center_server_config;

netbus.start_tcp_server(center.host, center.port, false);
service_manager.register_service(Stype.Auth, auth_service);

//連接數據庫
var mysql_center = require("../../database/mysql_center");
var center_database = game_config.center_database;
mysql_center.connect(center_database.host, center_database.port, center_database.user, center_database.password, center_database.database);
