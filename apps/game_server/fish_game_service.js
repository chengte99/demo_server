var Stype = require("../Stype");
var log = require("../../utils/log");
var Cmd = require("../Cmd");
var Response = require("../Response");
var fish_game_model = require("./fish_game_model");

function enter_zone(session, body, utag, proto_type){
    if(!body){
        session.send_cmd(stype, ctype, Response.INVAILD_PARAMS, utag, proto_type);
        return;
    }

    fish_game_model.enter_zone(utag, body, session, proto_type, function(ret){
        session.send_cmd(stype, ctype, ret, utag, proto_type);
    });
}

var service = {
    name: "fish_game service",
    is_transfer: false,

    //收到客戶端給我們的數據
    on_player_recv_cmd: function(session, stype, ctype, body, utag, proto_type, raw_cmd){
        log.info("on_player_recv_cmd: ", stype, ctype, body);
        switch(ctype){
            case Cmd.FishGame.ENTER_ZONE:
                enter_zone(session, body, utag, proto_type);
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
