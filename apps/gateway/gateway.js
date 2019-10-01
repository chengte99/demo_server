var netbus = require("../../netbus/netbus");
var proto_man = require("../../netbus/proto_man");
var game_config = require("../game_config");

var host = game_config.gateway_config.host;
var ports = game_config.gateway_config.ports;

netbus.start_tcp_server(host, ports[0], proto_man.PROTO_BUF, true);
netbus.start_tcp_server(host, ports[1], proto_man.PROTO_JSON, true);
netbus.start_ws_server(host, ports[2], proto_man.PROTO_BUF, true);
netbus.start_ws_server(host, ports[3], proto_man.PROTO_JSON, true);

var gateway_connect_service_config = game_config.gateway_connect_service_config;
for(var key in gateway_connect_service_config){
    netbus.connect_to_server(gateway_connect_service_config[key].stype, gateway_connect_service_config[key].host, 
        gateway_connect_service_config[key].port, proto_man.PROTO_BUF, false);
}