require("../../init");
var netbus = require("../../netbus/netbus");
var proto_man = require("../../netbus/proto_man");
var service_manager = require("../../netbus/service_manager");
var game_config = require("../game_config");

var fish_game_service = require("./fish_game_service");
var Stype = require("../Stype");

var fgame = game_config.game_servcer_config

netbus.start_tcp_server(fgame.host, fgame.port, false);
service_manager.register_service(Stype.FishGame, fish_game_service);

// 連接數據庫
var mysql_game = require("../../database/mysql_game");
var game_database = game_config.game_database;
mysql_game.connect(game_database.host, game_database.port, game_database.user, game_database.password, game_database.database);

// 連接redis_center
var redis_center = require("../../database/redis_center");
var center_redis = game_config.center_redis;
redis_center.connect(center_redis.host, center_redis.port, center_redis.db_index);

// 連接redis_game
var redis_game = require("../../database/redis_game");
var game_redis = game_config.game_redis;
redis_game.connect(game_redis.host, game_redis.port, game_redis.db_index);
