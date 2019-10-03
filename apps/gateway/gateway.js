require("../../init");
var netbus = require("../../netbus/netbus");
var proto_man = require("../../netbus/proto_man");
var game_config = require("../game_config");
var service_manager = require("../../netbus/service_manager");
var gw_service = require("./gw_service");

var host = game_config.gateway_config.host;
var ports = game_config.gateway_config.ports;

netbus.start_tcp_server(host, ports[0], true);
netbus.start_ws_server(host, ports[1], true);

var gateway_connect_service_config = game_config.gateway_connect_service_config;
for(var key in gateway_connect_service_config){
    netbus.connect_to_server(gateway_connect_service_config[key].stype, gateway_connect_service_config[key].host, 
        gateway_connect_service_config[key].port, proto_man.PROTO_BUF, false);
    service_manager.register_service(gateway_connect_service_config[key].stype, gw_service);
}