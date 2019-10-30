var netbus = require("../../netbus/netbus");
var proto_man = require("../../netbus/proto_man");
var proto_tools = require("../../netbus/proto_tools");
var log = require("../../utils/log");
var Cmd = require("../Cmd");
var Stype = require("../Stype");
var Response = require("../Response");
var game_system_model = require("./game_system_model");

function get_game_info(session, body, utag, proto_type){
    game_system_model.get_game_info(utag, function(ret){
        session.send_cmd(Stype.GameSystem, Cmd.GameSystem.GET_GAME_INFO, ret, utag, proto_type);
    });
}

var service = {
    name: "game_system service",
    is_transfer: false,

    //收到客戶端給我們的數據
    on_player_recv_cmd: function(session, stype, ctype, body, utag, proto_type, raw_cmd){
        log.info("on_player_recv_cmd: ", stype, ctype, body);
        switch(ctype){
            case Cmd.GameSystem.GET_GAME_INFO:
                get_game_info(session, body, utag, proto_type);
                break;
        }
    },

    //收到我們連接的服務給我們的數據
    on_service_recv_cmd: function(session, stype, ctype, body, utag, proto_type, raw_cmd){

    },

    //收到客戶端斷線
    on_player_disconnect: function(stype, session){
        log.warn("lost connect with gateway ...", stype);
    }
}

module.exports = service;
