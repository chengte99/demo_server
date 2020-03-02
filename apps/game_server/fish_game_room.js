var log = require("../../utils/log");
var Cmd = require("../Cmd");
var Stype = require("../Stype");
var Response = require("../Response");
var QuitReason = require("./QuitReason");
var game_config = require("../game_config");
var proto_man = require("../../netbus/proto_man");
var State = require("./State");
var fish_game_road = require("./fish_game_road");
var fish_game_model = require("./fish_game_model");

var INVIEW_SEAT = 4;
var GAME_SEAT = 2;
var ROAD_SET = 16;

var Inroom_Fish_uid = 1;

function write_err(status, ret_func){
    var ret = {};
    ret[0] = status;
    ret_func(ret);
}

function fish_game_room(room_id, conf){
    this.room_id = room_id;
    this.zid = conf.zid;
    this.enter_vip = conf.enter_vip;
    this.min_chip = conf.chip;
    this.state = State.Ready;

    //init INVIEW_SEAT
    this.inview_players = [];
    for(var i = 0; i < INVIEW_SEAT; i ++){
        this.inview_players.push(null);
    }

    //init GAME_SEAT
    this.game_seats = [];
    for(var i = 0; i < GAME_SEAT; i ++){
        this.game_seats.push(null);
    }

    // 產生魚行走路徑
    this.road_set = [];
    for(var i = 0; i < ROAD_SET; i ++){
        var road = new fish_game_road(i);
        this.road_set.push(road);
    }

    // 每2s檢查房間狀態決定放魚
    setInterval(function(){
        if(this.state == State.Playing){
            if (this.check_game_seats_state()){
                this.put_fish();
            }
        }
    }.bind(this), 2000);

    // 每60s踢出已斷線玩家
    setInterval(function(){
        this.kick_lostconnection_users();
    }.bind(this), 60000);
}

fish_game_room.prototype.kick_lostconnection_users = function(){
    // var empty_num = 0;
    for(var i = 0; i < GAME_SEAT; i ++){
        if(this.game_seats[i] && this.game_seats[i].state == State.Playing && this.game_seats[i].session == null){
            log.info("該玩家已斷線 ...");
            // 系統踢出
            fish_game_model.kick_offine_player(this.game_seats[i].uid);
        }
    }

    // if(empty_num == GAME_SEAT){
    //     this.state = State.Ready;
    //     log.info("座位上均已斷線，房間狀態改為Ready ...");
    //     // 回收所有魚(將路線全改成Idle)
    //     for(var i = 0; i < ROAD_SET; i ++){
    //         this.road_set[i].state = State.Road_Idle;    
    //     }
    // }
}

fish_game_room.prototype.search_empty_seat_inview_players = function(){
    for(var i = 0; i < INVIEW_SEAT; i ++){
        if(!this.inview_players[i]){
            return i;
        }
    }

    return -1;
}

fish_game_room.prototype.search_empty_seat = function(){
    for(var i = 0; i < GAME_SEAT; i ++){
        if(!this.game_seats[i]){
            return i;
        }
    }

    return -1;
}

fish_game_room.prototype.get_user_arrived = function(other){
    var body = {
        0: other.seat_id,

        1: other.unick,
        2: other.usex,
        3: other.uface,

        4: other.uchip,
        5: other.uexp,
        6: other.uvip,
        7: other.state,
    }
    return body;
}

fish_game_room.prototype.player_enter_room = function(player){
    var inview_seat = this.search_empty_seat_inview_players();
    if(inview_seat < 0){
        log.error("inview seats is full ...");
        return;
    }

    player.room_id = this.room_id;
    this.inview_players[inview_seat] = player;
    player.enter_room(this);

    //通知該房間的用戶，如果有必要的話
    //

    log.info("player uid:", player.uid, ", enter_room:", player.room_id);
    var body = {
        0: Response.OK,
        1: this.zid,
        2: this.room_id,
    }
    player.send_cmd(Stype.FishGame, Cmd.FishGame.ENTER_ROOM, body);

    //將已經在座位上的人通知該用戶
    for(var i = 0; i < GAME_SEAT; i ++){
        if(!this.game_seats[i]){
            continue;
        }
        var other = this.game_seats[i];
        var body = this.get_user_arrived(other);
        player.send_cmd(Stype.FishGame, Cmd.FishGame.USER_ARRIVED, body);
    }

    //自動配座 或是 手點點座位(由客戶端送seat_id，server驗證後坐下)
    //這邊使用自動
    this.do_sitdown(player);
}

fish_game_room.prototype.player_exit_room = function(player, quit_reason){
    if(quit_reason == QuitReason.UserLostConn && this.state == State.Playing && player.state == State.Playing){
        return false;
    }

    if(player.seat_id != -1){
        // if(player.state == State.Playing){
        //     var winner_seat_id = GAME_SEAT - player.seat_id - 1; //對家贏
        //     var winner = this.game_seats[winner_seat_id];
        //     this.check_out_game(1, winner);
        // }

        this.do_standup(player);
    }

    player.room_id = -1;
    for(var i in this.inview_players){
        if(this.inview_players[i] == player){
            this.inview_players[i] = null;
        }
    }
    player.exit_room(this);

    log.info("player uid:", player.uid, ", exit_room");
    var status = Response.OK;
    player.send_cmd(Stype.FishGame, Cmd.FishGame.EXIT_ROOM, status);

    //離開房間，廣播給房間內的人（包括旁觀者），有必要的話
    // 

    return true;
}

fish_game_room.prototype.do_sitdown = function(player){
    var sv_seat = this.search_empty_seat();
    if(sv_seat < 0){
        log.warn("game_seats all full .");
        return;
    }

    this.game_seats[sv_seat] = player;
    player.seat_id = sv_seat;
    player.sit_down(this);

    log.info("player uid:", player.uid, ", sitdown seat:", player.seat_id);
    var body = {
        0: Response.OK,
        1: sv_seat,
    }
    player.send_cmd(Stype.FishGame, Cmd.FishGame.USER_SITDOWN, body);

    //廣播給座位上的人（包含旁觀）
    var body = this.get_user_arrived(player);
    this.room_broadcast(Stype.FishGame, Cmd.FishGame.USER_ARRIVED, body, player.uid);
    //
}

fish_game_room.prototype.do_standup = function(player){
    var sv_seat = player.seat_id;
    this.game_seats[player.seat_id] = null;
    player.seat_id = -1;
    player.stand_up(this);

    log.info("player uid:", player.uid, ", standup seat");
    var body = {
        0: Response.OK,
        1: sv_seat
    }
    //站起，廣播給房間內的人(包括自己)
    this.room_broadcast(Stype.FishGame, Cmd.FishGame.USER_STANDUP, body, null);
    //
}

fish_game_room.prototype.empty_seat = function(){
    var num = 0;
    for(var i in this.game_seats){
        if(this.game_seats[i] === null){
            num ++;
        }
    }

    return num;
}

//根據旁觀者列表發送
fish_game_room.prototype.room_broadcast = function(stype, ctype, body, not_to_uid){
    var json_uid = [];
    var buf_uid = [];

    var json_cmd_buf = null;
    var buf_cmd_buf = null;

    var gw_session = null;
    for(var i = 0; i < this.inview_players.length; i ++){
        if(!this.inview_players[i] || 
            this.inview_players[i].session == null || 
            this.inview_players[i].uid == not_to_uid){
            continue;
        }

        gw_session = this.inview_players[i].session;
        if(this.inview_players[i].proto_type == proto_man.PROTO_JSON){
            json_uid.push(this.inview_players[i].uid);
            if(!json_cmd_buf){
                json_cmd_buf = proto_man.encode_cmd(0, proto_man.PROTO_JSON, stype, ctype, body);
            }
        }else{
            buf_uid.push(this.inview_players[i].uid);
            if(!buf_cmd_buf){
                buf_cmd_buf = proto_man.encode_cmd(0, proto_man.PROTO_BUF, stype, ctype, body);
            }
        }
    }

    if(json_uid.length > 0){
        var ret = {
            cmd_buf: json_cmd_buf,
            users: json_uid,
        }
        gw_session.send_cmd(Stype.Broadcast, Cmd.BROADCAST, ret, 0, proto_man.PROTO_BUF);
    }

    if(buf_uid.length > 0){
        var ret = {
            cmd_buf: buf_cmd_buf,
            users: buf_uid,
        }
        gw_session.send_cmd(Stype.Broadcast, Cmd.BROADCAST, ret, 0, proto_man.PROTO_BUF);
    }
}

fish_game_room.prototype.send_bullet = function(player, seat_id, level, road_index, ret_func){
    if(level <= 0 || level > 2){
        write_err(Response.INVAILD_PARAMS, ret_func);
        return;
    }

    var cost, damage, speed;
    var bullet_level = game_config.ugame_config.bullet_level;
    for(var key in bullet_level){
        if(bullet_level[key].level == level){
            cost = bullet_level[key].cost;
            damage = bullet_level[key].damage;
            speed = bullet_level[key].speed;
        }
    }

    // 更新uchip數據
    player.update_uchip(cost, false);

    var body = {
        0: Response.OK,
        1: seat_id,
        2: level,
        3: player.uchip,
        4: damage,
        5: speed,
        6: road_index,
    }

    player.send_cmd(Stype.FishGame, Cmd.FishGame.SEND_BULLET, body);

    // 廣播其他用戶
    this.room_broadcast(Stype.FishGame, Cmd.FishGame.SEND_BULLET, body, player.uid);
}

fish_game_room.prototype.check_game_seats_state = function(){
    for(var i = 0; i < GAME_SEAT; i ++){
        if(this.game_seats[i] && this.game_seats[i].state == State.Playing){
            log.info("someone is playing ...");
            return true;
        }
    }

    log.info("noone is playing ...");
    this.state = State.Ready;
    
    // 回收所有魚(將路線全改成Idle)
    for(var i = 0; i < ROAD_SET; i ++){
        this.road_set[i].state = State.Road_Idle;    
    }
    return false;
}

fish_game_room.prototype.check_game_start = function(){
    var ready_num = 0;
    for(var i = 0; i < GAME_SEAT; i ++){
        if(!this.game_seats[i] || this.game_seats[i].state != State.Ready){
            continue;
        }
        ready_num ++;
    }

    if(ready_num > 0){
        this.game_start();        
    }
}

fish_game_room.prototype.game_start = function(){
    //改變位置上玩家的狀態
    for(var i = 0; i < GAME_SEAT; i ++){
        if(!this.game_seats[i] || this.game_seats[i].state != State.Ready){
            continue;
        }
        this.game_seats[i].on_game_start();
    }

    // 改變房間狀態
    this.state = State.Playing;

    // // 定時每三秒產生一隻魚
    // setInterval(function(){
    //     this.put_fish();
    // }.bind(this), 3000);
}

fish_game_room.prototype.put_fish = function(){
    // 隨機挑選路線
    var road_index = Math.floor(Math.random() * ROAD_SET);
    if(road_index >= ROAD_SET){
        road_index = ROAD_SET - 1;
    }
    // 若路線已被使用則return
    if(this.road_set[road_index].state == State.Road_Useing){
        return;
    }
    this.road_set[road_index].state = State.Road_Useing;

    // 隨機挑選魚種類
    var index = Math.floor(Math.random() * game_config.ugame_config.fish_game_fish_type_max);
    if(index >= game_config.ugame_config.fish_game_fish_type_max){
        index = game_config.ugame_config.fish_game_fish_type_max - 1;
    }

    var ret = game_config.ugame_config.fish_game_fish_type[index];

    var body = {
        0: ret.id,
        1: ret.health,
        2: ret.speed,
        3: road_index,
        4: Inroom_Fish_uid,
    }

    // 房間內魚編號(遞增不重複)
    Inroom_Fish_uid ++;

    // 廣播
    this.room_broadcast(Stype.FishGame, Cmd.FishGame.PUT_FISH, body, null);
}

fish_game_room.prototype.do_ready = function(player, ret_func){
    if(player != this.game_seats[player.seat_id]){
        write_err(Response.INVAILD_OPT, ret_func);
        return;
    }

    if(player.state != State.InView){
        write_err(Response.INVAILD_OPT, ret_func);
        return;
    }

    player.do_ready();
    
    // var body = {
    //     0: Response.OK,
    //     1: player.seat_id,
    // }
    // this.room_broadcast(Stype.FishGame, Cmd.FishGame.DO_READY, body, null);
    player.send_cmd(Stype.FishGame, Cmd.FishGame.DO_READY, Response.OK);

    //check ready's player number
    if(this.state != State.Playing){
        this.check_game_start();
    }else{
        player.on_game_start();
    }
}

fish_game_room.prototype.recover_fish = function(player, bonus, road_index, seat_id, ret_func){
    // 將該road設為閒置
    if(this.road_set[road_index].state == State.Road_Idle){
        return;
    }
    this.road_set[road_index].state = State.Road_Idle;

    // 更新uchip數據
    if(seat_id != -1){
        // 由座位上user殺死的
        player.update_uchip(bonus, true);
    }

    var body = {
        0: Response.OK,
        1: seat_id,
        2: road_index,
        3: player.uchip,
    }

    player.send_cmd(Stype.FishGame, Cmd.FishGame.RECOVER_FISH, body);

    // 廣播其他用戶
    this.room_broadcast(Stype.FishGame, Cmd.FishGame.RECOVER_FISH, body, player.uid);
}

fish_game_room.prototype.do_reconnect = function(p){
    if(p.session == null || p.state != State.Playing || this.state != State.Playing){
        return
    }

    //自己的座位號
    //p.seat_id

    //已抵達座位上的數據
    var arrived_data = [];
    for(var i = 0; i < GAME_SEAT; i ++){
        if(!this.game_seats[i] || this.game_seats[i] == p || this.game_seats[i].state != State.Playing){
            continue;
        }

        var user_info = this.get_user_arrived(this.game_seats[i]);
        arrived_data.push(user_info);
    }

    var body = {
        0: p.seat_id,
        1: arrived_data,
        2: p.room_id
    }

    p.send_cmd(Stype.FishGame, Cmd.FishGame.RECONNECT, body);
}

module.exports = fish_game_room;