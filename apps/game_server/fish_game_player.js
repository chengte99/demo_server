var log = require("../../utils/log");
var Cmd = require("../Cmd");
var Response = require("../Response");

function fish_game_player(uid){
    this.uid = uid;
    this.unick = "";
    this.usex = -1;
    this.uface = -1;

    this.uexp = 0;
    this.uchip = 0;
    this.uvip = 0;

    this.zid = -1;
    this.room_id = -1;
    this.seat_id = -1;

    this.session = null;
    this.proto_type = -1;
}

fish_game_player.prototype.init_uinfo = function(uinfo){
    this.unick = uinfo.unick;
    this.usex = uinfo.usex;
    this.uface = uinfo.uface;
}

fish_game_player.prototype.init_ugame_info = function(ugame_info){
    this.uexp = ugame_info.uexp;
    this.uchip = ugame_info.uchip;
    this.uvip = ugame_info.uvip;
}

fish_game_player.prototype.init_session = function(session, proto_type){
    this.session = session;
    this.proto_type = proto_type;
}

fish_game_player.prototype.enter_room = function(room){
    
}

fish_game_player.prototype.exit_room = function(room){
    
}

fish_game_player.prototype.sit_down = function(room){
    
}

fish_game_player.prototype.stand_up = function(){
    
}

fish_game_player.prototype.send_cmd = function(stype, ctype, body){
    if(!this.session){
        log.warn("session is null, send_cmd failed");
        return;
    }

    this.session.send_cmd(stype, ctype, body, this.uid, this.proto_type);
}

module.exports = fish_game_player;