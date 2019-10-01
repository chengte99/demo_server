var netbus = require("../../netbus/netbus");

var service = {
    name: "gw_service",
    is_transfer: true,

    //收到客戶端給我們的數據
    on_player_recv_cmd: function(session, stype, ctype, body, utag, proto_type, raw_cmd){
        var service_session = netbus.get_service_session(stype);
        
    },

    //收到我們連接的服務給我們的數據
    on_service_recv_cmd: function(session, stype, ctype, body, utag, proto_type, raw_cmd){

    },

    //收到客戶端斷線
    on_player_disconnect: function(session){
        
    }
}

module.exports = service;