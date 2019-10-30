require("../../init");
var netbus = require("../../netbus/netbus");
var proto_man = require("../../netbus/proto_man");
var service_manager = require("../../netbus/service_manager");
var game_config = require("../game_config");

var game_system_service = require("./game_system_service");
var Stype = require("../Stype");

var game_system = game_config.system_servcer_config;

netbus.start_tcp_server(game_system.host, game_system.port, false);
service_manager.register_service(Stype.GameSystem, game_system_service);

//連接數據庫
var mysql_game = require("../../database/mysql_game");
var game_database = game_config.game_database;
mysql_game.connect(game_database.host, game_database.port, game_database.user, game_database.password, game_database.database);

//連接redis
var redis_center = require("../../database/redis_center");
var center_redis = game_config.center_redis;
redis_center.connect(center_redis.host, center_redis.port, center_redis.db_index);

var redis_game = require("../../database/redis_game");
var game_redis = game_config.game_redis;
redis_game.connect(game_redis.host, game_redis.port, game_redis.db_index);