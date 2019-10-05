var log = require("../../utils/log");
var proto_man = require("../../netbus/proto_man");
var Cmd = require("../Cmd");
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
        var utag = Room[key].utag;
        var proto_type = Room[key].proto_type;
        if(utag == noto_user){
            continue;
        };
        
        //本來可以這樣做，但會浪費效能，每次都要重新encode
        //session.send_cmd(STYPE_TALKKROOM, ctype, uinfo);
        if(proto_type == proto_man.PROTO_JSON){
            if(!json_encoded){
                json_encoded = proto_man.encode_cmd(utag, proto_type, STYPE_TALKKROOM, ctype, uinfo);
            }
            session.send_encode_cmd(json_encoded);
        }else if(proto_type == proto_man.PROTO_BUF){
            if(!buf_encoded){
                buf_encoded = proto_man.encode_cmd(utag, proto_type, STYPE_TALKKROOM, ctype, uinfo);
            }
            session.send_encode_cmd(buf_encoded);
        }
    }
}

function user_enter_room(session, body, utag, proto_type){
    if(Room[utag]){
        session.send_cmd(STYPE_TALKKROOM, TalkCmd.Enter, Response.IN_ROOM, utag, proto_type);
        return;
    }

    //通知自己已進入
    session.send_cmd(STYPE_TALKKROOM, TalkCmd.Enter, Response.OK, utag, proto_type);

    //廣播給房間其他用戶有人進入
    boardcase_cmd(TalkCmd.UserArrived, body, utag);

    //把房間內的用戶通知給自己
    for(var key in Room){
        session.send_cmd(STYPE_TALKKROOM, TalkCmd.UserArrived, Room[key].uinfo, utag, proto_type);
    }

    //將該session信息加入房間表
    var talkman = {
        session: session,
        uinfo: body,
        utag: utag,
        proto_type: proto_type,
    }
    Room[utag] = talkman;
}

function user_exit_room(session, is_lost_connect, utag, proto_type){
    if(!Room[utag]){
        if(!is_lost_connect){
            session.send_cmd(STYPE_TALKKROOM, TalkCmd.Exit, Response.NOT_IN_ROOM, utag, proto_type);
        }
        return;
    }

    //通知房間其他用戶自己離開
    boardcase_cmd(TalkCmd.UserExit, Room[utag].uinfo, utag);

    //刪除房間表自己資料
    Room[utag] = null;
    delete Room[utag];

    //通知自己離開
    if(!is_lost_connect){
        session.send_cmd(STYPE_TALKKROOM, TalkCmd.Exit, Response.OK, utag, proto_type);
    }
}

function user_send_msg(session, body, utag, proto_type){
    if(!Room[utag]){
        session.send_cmd(STYPE_TALKKROOM, TalkCmd.SendMsg, {
            0: Response.INVALID_OPT,
        }, utag, proto_type);
        return;
    }

    //通知自己
    session.send_cmd(STYPE_TALKKROOM, TalkCmd.SendMsg, {
        0: Response.OK,
        1: Room[utag].uinfo.uname,
        2: Room[utag].uinfo.usex,
        3: body
    }, utag, proto_type)

    //廣播訊息給其他用戶
    boardcase_cmd(TalkCmd.UserMsg, {
        0: Room[utag].uinfo.uname,
        1: Room[utag].uinfo.usex,
        2: body 
    }, utag);
}


var service = {
    name: "service talkroom",
    is_transfer: false,

    on_player_recv_cmd: function(session, stype, ctype, body, utag, proto_type, raw_cmd){
        log.info("on_player_recv_cmd: ", stype, ctype, body);
        switch(ctype){
            case TalkCmd.Enter:
                user_enter_room(session, body, utag, proto_type);
                break;
            case TalkCmd.Exit:
                user_exit_room(session, false, utag, proto_type);
                break;
            case TalkCmd.SendMsg:
                user_send_msg(session, body, utag, proto_type);
                break;
            case Cmd.USER_DISCONNECT:
                user_exit_room(session, true, utag, proto_type);
                break;
        }
    },

    on_player_disconnect: function(stype, session){
        log.warn("lost connect with gateway ...", stype);
        // log.info("on_player_disconnect, session_key: ", session.session_key);
        // user_exit_room(session, true);
    }
}

module.exports = service;