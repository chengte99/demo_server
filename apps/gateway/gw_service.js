var netbus = require("../../netbus/netbus");
var proto_man = require("../../netbus/proto_man");
var proto_tools = require("../../netbus/proto_tools");
var log = require("../../utils/log");
var Cmd = require("../Cmd");
var Stype = require("../Stype");
var Response = require("../Response");

function is_login_cmd(stype, ctype){
    if(stype != Stype.Auth){
        return false;
    }

    if(ctype == Cmd.Auth.GUEST_LOGIN){
        return true;
    }
    return false;
}

var session_uid_map = {};

function save_uid_session_map(session, uid, proto_type){
    session_uid_map[uid] = session;
    session.proto_type = proto_type;
}

function get_client_session_by_uid(uid){
    return session_uid_map[uid];
}

function clear_uid_session_map(uid){
    session_uid_map[uid] = null;
    delete session_uid_map[uid];
}

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
        if(is_login_cmd(stype, ctype)){
            utag = session.session_key;
        }else{
            if(session.uid == 0){ //非登入命令必定有更新uid，因此若為0則為非法操作
                return;
            }
            utag = session.uid;
        }
        
        proto_tools.write_utag_inbuf(raw_cmd, utag);
        service_session.send_encode_cmd(raw_cmd);
    },

    //收到我們連接的服務給我們的數據
    on_service_recv_cmd: function(session, stype, ctype, body, utag, proto_type, raw_cmd){
        var client_session;

        if(is_login_cmd(stype, ctype)){
            client_session = netbus.get_client_session(utag);
            if(!client_session){
                return;
            }

            var cmd = proto_man.decode_cmd(proto_type, stype, ctype, raw_cmd);
            body = cmd[2];
            if(body.status === Response.OK){
                var prev_client_session = get_client_session_by_uid(body.uid);
                if(prev_client_session){
                    // 重複登入
                    prev_client_session.send_cmd(stype, Cmd.Auth.RELOGIN, null, 0, prev_client_session.proto_type); // 往客戶端送RELOGIN訊息
                    prev_client_session.uid = 0; // 將先前登入的session uid設為0
                    netbus.session_close(prev_client_session); // 將先前登入的session關閉
                }

                client_session.uid = body.uid; // 已登入成功則將uid打入網關與客戶端的session
                save_uid_session_map(client_session, body.uid, proto_type); //將uid與session 建立對應表
                body.uid = 0; // 清除uid，不讓客戶端解析到
                raw_cmd = proto_man.encode_cmd(utag, proto_type, stype, ctype, body);
            }
        }else{
            client_session = get_client_session_by_uid(utag);
            if(!client_session){
                return;
            }
        }

        proto_tools.clear_utag_inbuf(raw_cmd);
        client_session.send_encode_cmd(raw_cmd);
    },

    //收到客戶端斷線
    on_player_disconnect: function(stype, session, uid){
        if(stype == Stype.Auth){
            clear_uid_session_map(uid);
        };

        var service_session = netbus.get_service_session(stype);
        if(!service_session){
            return;
        }

        // var utag = session.session_key;
        var utag = uid;
        service_session.send_cmd(stype, Cmd.USER_DISCONNECT, null, utag, proto_man.PROTO_JSON);
    }
}

service.get_client_session_by_uid = get_client_session_by_uid;
module.exports = service;