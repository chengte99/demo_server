var log = require("../utils/log");
var proto_man = require("../netbus/proto_man");
require("./talkroom_proto");

var STYPE_TALKKROOM = 1;

var TalkCmd = {
    Enter: 1,
    Exit: 2,
    UserArrived: 3,
    UserExit: 4,
    SendMsg: 5,
    UserMsg: 6,
};

var Response = {
    OK: 1,
    INVALID_OPT: -100,
    IN_ROOM: -101,
    NOT_IN_ROOM: -102,
}

var Room = {};

function boardcase_cmd(ctype, uinfo, noto_user){
    var json_encoded = null;
    var buf_encoded = null;
    for(var key in Room){
        var session = Room[key].session;
        if(session == noto_user){
            continue;
        };
        
        //本來可以這樣做，但會浪費效能，每次都要重新encode
        //session.send_cmd(STYPE_TALKKROOM, ctype, uinfo);
        if(session.proto_type == proto_man.PROTO_JSON){
            if(!json_encoded){
                json_encoded = proto_man.encode_cmd(proto_man.PROTO_JSON, STYPE_TALKKROOM, ctype, uinfo);
            }
            session.send_encode_cmd(json_encoded);
        }else if(session.proto_type == proto_man.PROTO_BUF){
            if(!buf_encoded){
                buf_encoded = proto_man.encode_cmd(proto_man.PROTO_BUF, STYPE_TALKKROOM, ctype, uinfo);
            }
            session.send_encode_cmd(buf_encoded);
        }
    }
}

function user_enter_room(session, body){
    if(Room[session.session_key]){
        session.send_cmd(STYPE_TALKKROOM, TalkCmd.Enter, Response.IN_ROOM);
        return;
    }

    //通知自己已進入
    session.send_cmd(STYPE_TALKKROOM, TalkCmd.Enter, Response.OK);

    //廣播給房間其他用戶有人進入
    boardcase_cmd(TalkCmd.UserArrived, body, session);

    //把房間內的用戶通知給自己
    for(var key in Room){
        session.send_cmd(STYPE_TALKKROOM, TalkCmd.UserArrived, Room[key].uinfo);
    }

    //將該session信息加入房間表
    var talkman = {
        session: session,
        uinfo: body
    }
    Room[session.session_key] = talkman;
}

function user_exit_room(session, is_lost_connect){
    if(!Room[session.session_key]){
        if(!is_lost_connect){
            session.send_cmd(STYPE_TALKKROOM, TalkCmd.Exit, Response.NOT_IN_ROOM);
        }
        return;
    }

    //通知房間其他用戶自己離開
    boardcase_cmd(TalkCmd.UserExit, Room[session.session_key].uinfo, session);

    //刪除房間表自己資料
    Room[session.session_key] = null;
    delete Room[session.session_key];

    //通知自己離開
    if(!is_lost_connect){
        session.send_cmd(STYPE_TALKKROOM, TalkCmd.Exit, Response.OK);
    }
}

function user_send_msg(session, body){
    if(!Room[session.session_key]){
        session.send_cmd(STYPE_TALKKROOM, TalkCmd.SendMsg, {
            0: Response.INVALID_OPT,
        });
        return;
    }

    //通知自己
    session.send_cmd(STYPE_TALKKROOM, TalkCmd.SendMsg, {
        0: Response.OK,
        1: Room[session.session_key].uinfo.uname,
        2: Room[session.session_key].uinfo.usex,
        3: body
    })

    //廣播訊息給其他用戶
    boardcase_cmd(TalkCmd.UserMsg, {
        0: Room[session.session_key].uinfo.uname,
        1: Room[session.session_key].uinfo.usex,
        2: body 
    }, session);
}


var service = {
    stype: 1,
    name: "service talkroom",
    is_transfer: false,

    init: function(){
        log.info("service talkroom init ...");
    },

    on_player_recv_cmd: function(session, ctype, body, raw_cmd){
        log.info("on_player_recv_cmd: ", ctype, body, raw_cmd);
        switch(ctype){
            case TalkCmd.Enter:
                user_enter_room(session, body);
                break;
            case TalkCmd.Exit:
                user_exit_room(session, false);
                break;
            case TalkCmd.SendMsg:
                user_send_msg(session, body);
                break;
        }
    },

    on_player_disconnect: function(session){
        log.info("on_player_disconnect, session_key: ", session.session_key);
        user_exit_room(session, true);
    }
}

module.exports = service;