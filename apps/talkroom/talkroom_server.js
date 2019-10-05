require("../../init");
var netbus = require("../../netbus/netbus");
var proto_man = require("../../netbus/proto_man");
var service_manager = require("../../netbus/service_manager");
var game_config = require("../game_config");

var talkroom = require("./talkroom");
var Stype = require("../Stype");

var host = game_config.talkroom_config.host;
var port = game_config.talkroom_config.port;

netbus.start_tcp_server(host, port, false);
service_manager.register_service(Stype.TalkRoom, talkroom);