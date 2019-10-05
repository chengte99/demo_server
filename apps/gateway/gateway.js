require("../../init");
var netbus = require("../../netbus/netbus");
var proto_man = require("../../netbus/proto_man");
var service_manager = require("../../netbus/service_manager");
var game_config = require("../game_config");

var gw_service = require("./gw_service");

var host = game_config.gateway_config.host;
var ports = game_config.gateway_config.ports;

netbus.start_tcp_server(host, ports[0], true);
netbus.start_ws_server(host, ports[1], true);

var game_servers = game_config.game_servers;
for(var key in game_servers){
    netbus.connect_to_server(game_servers[key].stype, game_servers[key].host, 
        game_servers[key].port, proto_man.PROTO_BUF, false);
    service_manager.register_service(game_servers[key].stype, gw_service);
}