module.exports = {
    enter_zone: enter_zone,
    user_quit: user_quit,
    user_disconnect: user_disconnect,
    send_bullet: send_bullet,
    do_ready: do_ready,
    recover_fish: recover_fish,
}

var Stype = require("../Stype");
var Cmd = require("../Cmd");
var log = require("../../utils/log");
var Response = require("../Response");
var QuitReason = require("./QuitReason");
var game_config = require("../game_config");
var fish_game_player = require("./fish_game_player");
var fish_gmae_room = require("./fish_game_room");

var mysql_game = require("../../database/mysql_game");
var redis_center = require("../../database/redis_center");
var redis_game = require("../../database/redis_game");

var player_set = {};
var zones = {};

function get_player(uid){
    if(player_set[uid]){
        return player_set[uid];
    }

    return null;
}

function zone(config){
    this.config = config;
    this.wait_list = {}; //用表做，玩家等待列表
    this.room_list = {}; //用表做，房間列表
    this.autoinc_room_id = 1;
}

function init_zone(){
    var zone_config = game_config.ugame_config.fish_game_zone;
    for(var i in zone_config){
        var zid = zone_config[i].zid;
        var z = new zone(zone_config[i]);
        zones[zid] = z;
    }
}

init_zone();

function player_enter_zone(uid, zid, player, ret_func){
    var zone = zones[zid];
    if(!zone){
        ret_func(Response.ZONE_IS_INVAILD);
        return;
    }

    if(player.uvip < zone.config.enter_vip){
        ret_func(Response.LEVEL_IS_NOT_ENOUGH);
        return;
    }

    if(player.uchip < zone.config.chip){
        ret_func(Response.CHIP_IS_NOT_ENOUGH);
        return;
    }

    player.zid = zid;
    player.room_id = -1;
    zone.wait_list[player.uid] = player;
    log.info("player uid: ", player.uid, " enter zone: ", player.zid);
    ret_func(Response.OK);
}

function alloc_player(uid, session, proto_type){
    if(player_set[uid]){
        return player_set[uid];
    }

    var player = new fish_game_player(uid);
    player.init_session(session, proto_type);
    return player;
}

function delete_player(uid){
    if(!player_set[uid]){
        log.warn("delete_player fail, player is empty in player_set");
    }else{
        player_set[uid].init_session(null, -1);
        player_set[uid] = null;
        delete player_set[uid];
    }
}

function get_ufino_inredis(uid, zid, player, ret_func){
    redis_center.get_uinfo_inredis(uid, function(status, uinfo){
        if(status != Response.OK){
            ret_func(status);
            return;
        }

        player.init_uinfo(uinfo);
        player_set[uid] = player;

        player_enter_zone(uid, zid, player, ret_func);
    })
}

function enter_zone(uid, zid, session, proto_type, ret_func){
    var player = get_player(uid);

    if(!player){
        log.info("player empty, create one ...");
        player = alloc_player(uid, session, proto_type);

        mysql_game.get_game_info_by_uid(uid, function(status, sql_result){
            if(status != Response.OK){
                ret_func(status);
                return;
            }

            if(sql_result.length <= 0){
                ret_func(Response.INVALID_OPT);
                return;
            }

            var data = sql_result[0];
            if(data.status != 1){
                ret_func(Response.ILLEGAL_ACCOUNT);
                return;
            }

            player.init_ugame_info(data);
            get_ufino_inredis(uid, zid, player, ret_func);

        })
    }else{
        log.info("player exist ...");
        if(player.zid != -1 && player.room_id != -1){
            var zone = zones[player.zid];
            var room = zone.room_list[player.room_id];

            //把斷線player的session 恢復 
            player.init_session(session, proto_type);
            //將當前房間數據傳給客戶端，回到遊戲
            room.do_reconnect(player);
            
        }else{
            player_enter_zone(uid, zid, player, ret_func);
        }
    }
}

function alloc_room(zone){
    var room = new fish_gmae_room(zone.autoinc_room_id ++, zone.config);

    log.info("create room, room_id: ", room.room_id);
    zone.room_list[room.room_id] = room;
    return room;
}

function do_search_room(zone){
    var min_seat_num = 1000000;
    var min_seat_room = null;

    for(var i in zone.room_list){
        var room = zone.room_list[i];
        if(room){
            var empty_num = room.empty_seat();
            if(empty_num >= 1){
                if(empty_num < min_seat_num){
                    min_seat_num = empty_num;
                    min_seat_room = room;
                }
            }
        }
    }

    if(min_seat_room){
        return min_seat_room;
    }

    // no valid room, create one
    var room = alloc_room(zone);
    min_seat_room = room;
    return min_seat_room;
}

function do_assign_room(){
    for(var i in zones){
        var zone = zones[i];
        for(var key in zone.wait_list){
            var p = zone.wait_list[key];
            if(p){
                var room = do_search_room(zone);
                if(room){
                    room.player_enter_room(p);

                    zone.wait_list[p.uid] = null;
                    delete zone.wait_list[p.uid];
                }
            }
        }
    }
}

setInterval(do_assign_room, 1000);

function do_user_quit(uid, quit_reason){
    var player = get_player(uid);
    if(!player){
        log.warn("do_user_quit fail, player is empty in player_set");
        return;
    }

    if(quit_reason == QuitReason.UserLostConn){
        log.info("quit_reason == QuitReason.UserLostConn");
        player.init_session(null, -1);
    }

    log.info("player uid:", uid, ", quit game_server reason:", quit_reason);
    if(player.zid != -1 && zones[player.zid]){
        var zone = zones[player.zid];
        //有player且有在分區內
        if(player.room_id != -1){
            //在遊戲房間內
            log.info("player uid:", uid, ", at room:", player.room_id);
            var room = zone.room_list[player.room_id];
            if(room){
                // console.log(room);
                // console.log(player);

                //若被動掉線時，玩家正在房間內遊戲，則不退出
                if(!room.player_exit_room(player, quit_reason)){
                    return;
                }
            }else{
                player.room_id = -1;
            }
            player.zid = -1;
        }else{
            //不在房間，在區間等待列表內
            if(zone.wait_list[player.uid]){
                log.info("player uid:", uid, ", remove from waitlist at zone");
                player.zid = -1;
                player.room_id = -1;
                zone.wait_list[player.uid] = null;
                delete zone.wait_list[player.uid];
            }
        }
    }
    delete_player(uid);
}

function user_quit(uid, ret_func){
    do_user_quit(uid, QuitReason.UserQuit);
    ret_func(Response.OK);
}

function user_disconnect(uid){
    do_user_quit(uid, QuitReason.UserLostConn);
}

function kick_user_for_chip_not_enough(uid){
    do_user_quit(uid, QuitReason.NotEnough);
}

function kick_offine_player(uid){
    do_user_quit(uid, QuitReason.SystemKick);
}

function send_bullet(uid, seat_id, level, ret_func){
    var player = get_player(uid);
    if(!player){
        write_err(Response.INVAILD_OPT, ret_func);
        return;
    }

    if(player.zid === -1 || player.room_id === -1){
        write_err(Response.INVAILD_OPT, ret_func);
        return;
    }

    var zone = zones[player.zid];
    if(!zone){
        write_err(Response.INVAILD_OPT, ret_func);
        return;
    }

    var room = zone.room_list[player.room_id];
    if(!room){
        write_err(Response.INVAILD_OPT, ret_func);
        return;
    }

    room.send_bullet(player, seat_id, level, ret_func);
}

function do_ready(uid, ret_func){
    var player = get_player(uid);
    if(!player){
        write_err(Response.INVAILD_OPT, ret_func);
        return;
    }

    if(player.zid === -1 || player.room_id === -1){
        write_err(Response.INVAILD_OPT, ret_func);
        return;
    }

    var zone = zones[player.zid];
    if(!zone){
        write_err(Response.INVAILD_OPT, ret_func);
        return;
    }

    var room = zone.room_list[player.room_id];
    if(!room){
        write_err(Response.INVAILD_OPT, ret_func);
        return;
    }

    room.do_ready(player, ret_func);
}

function recover_fish(uid, bonus, road_index, seat_id, ret_func){
    var player = get_player(uid);
    if(!player){
        write_err(Response.INVAILD_OPT, ret_func);
        return;
    }

    if(player.zid === -1 || player.room_id === -1){
        write_err(Response.INVAILD_OPT, ret_func);
        return;
    }

    var zone = zones[player.zid];
    if(!zone){
        write_err(Response.INVAILD_OPT, ret_func);
        return;
    }

    var room = zone.room_list[player.room_id];
    if(!room){
        write_err(Response.INVAILD_OPT, ret_func);
        return;
    }

    room.recover_fish(player, bonus, road_index, seat_id, ret_func);
}
