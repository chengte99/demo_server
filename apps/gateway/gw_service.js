var netbus = require("../../netbus/netbus");
var proto_man = require("../../netbus/proto_man");
var proto_tools = require("../../netbus/proto_tools");

var service = {
    name: "gw_service",
    is_transfer: true,

    //收到客戶端給我們的數據
    on_player_recv_cmd: function(session, stype, ctype, body, utag, proto_type, raw_cmd){
        var service_session = netbus.get_service_session(stype);
        if(!service_session){
            return;
        }

        //utag, session_key未登入, udid已登入
        proto_tools.write_utag_inbuf(raw_cmd, session.session_key);
        service_session.send_encode_cmd(raw_cmd);
    },

    //收到我們連接的服務給我們的數據
    on_service_recv_cmd: function(session, stype, ctype, body, utag, proto_type, raw_cmd){
        var client_session = netbus.get_client_session(utag);
        if(!client_session){
            return;
        }

        proto_tools.clear_utag_inbuf(raw_cmd);
        client_session.send_encode_cmd(raw_cmd);
    },

    //收到客戶端斷線
    on_player_disconnect: function(stype, session){
        var service_session = netbus.get_service_session(stype);
        if(!service_session){
            return;
        }

        service_session.send_cmd(stype, proto_man.GW_DISCONNECT, null, session.session_key, proto_man.PROTO_JSON);
    }
}

module.exports = service;