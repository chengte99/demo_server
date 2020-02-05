var log = require("../../utils/log");
var Cmd = require("../Cmd");
var Stype = require("../Stype");
var Response = require("../Response");
var fish_game_model = require("./fish_game_model");
require("../gateway/bc_proto");

function enter_zone(session, body, utag, proto_type){
    if(!body){
        session.send_cmd(Stype.FishGame, Cmd.FishGame.ENTER_ZONE, Response.INVAILD_PARAMS, utag, proto_type);
        return;
    }

    fish_game_model.enter_zone(utag, body, session, proto_type, function(ret){
        session.send_cmd(Stype.FishGame, Cmd.FishGame.ENTER_ZONE, ret, utag, proto_type);
    });
}

function user_quit(session, body, utag, proto_type){
    fish_game_model.user_quit(utag, function(ret){
        session.send_cmd(Stype.FishGame, Cmd.FishGame.USER_QUIT, ret, utag, proto_type);
    });
}

function send_bullet(session, body, utag, proto_type){
    if(!body){
        session.send_cmd(Stype.FishGame, Cmd.FishGame.SEND_BULLET, Response.INVAILD_PARAMS, utag, proto_type);
        return;
    }

    var seat_id = body[0];
    var level = body[1];

    fish_game_model.send_bullet(utag, seat_id, level, function(ret){
        session.send_cmd(Stype.FishGame, Cmd.FishGame.SEND_BULLET, ret, utag, proto_type);
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
            case Cmd.FishGame.USER_QUIT:
                user_quit(session, body, utag, proto_type);
                break;
            case Cmd.FishGame.SEND_BULLET:
                send_bullet(session, body, utag, proto_type);
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
