var log = require("../utils/log");
var proto_man = require("./proto_man");

var service_manager = {
    on_client_recv_cmd: on_client_recv_cmd,
    on_client_lost_connect: on_client_lost_connect,
    register_service: register_service,

    on_service_return_cmd: on_service_return_cmd,
};

var service_modules = {};

function register_service(stype, service){
    if(service_modules[stype]){
        log.warn("service stype: " + stype + " is reged !");
    }

    service_modules[stype] = service;
}

function on_client_recv_cmd(session, cmd_buf){
    if(session.is_encrypt){
        // console.log("decrypt");
        cmd_buf = proto_man.decrypt_cmd(cmd_buf);
    }

    var stype, ctype, body, utag, proto_type;
    var cmd = proto_man.decode_cmd_header(cmd_buf);
    if(!cmd){
        return false;
    }
    stype = cmd[0];
    ctype = cmd[1];
    utag = cmd[2];
    proto_type = cmd[3];

    if(!service_modules[stype]){
        return false
    }

    if(service_modules[stype].is_transfer){
        service_modules[stype].on_player_recv_cmd(session, stype, ctype, null, utag, proto_type, cmd_buf);
        return true;
    }
    
    cmd = proto_man.decode_cmd(proto_type, stype, ctype, cmd_buf);
    if(!cmd){
        return false;
    }
    
    body = cmd[2];
    service_modules[stype].on_player_recv_cmd(session, stype, ctype, body, utag, proto_type, null);

    return true;
}

function on_client_lost_connect(session){
    var uid = session.uid;
    if(uid == 0){ // uid = 0表示還未登入成功，還不是有效的連線，因此網關也無需通知其他服務。
        return;
    }

    for(var key in service_modules){
        service_modules[key].on_player_disconnect(key, session, uid);
    }
}

// ------------------------------------------------------------------------

function on_service_return_cmd(session, cmd_buf){
    if(session.is_encrypt){
        // console.log("decrypt");
        cmd_buf = proto_man.decrypt_cmd(cmd_buf);
    }

    var stype, ctype, body, utag, proto_type;
    var cmd = proto_man.decode_cmd_header(cmd_buf);
    if(!cmd){
        return false;
    }
    stype = cmd[0];
    ctype = cmd[1];
    utag = cmd[2];
    proto_type = cmd[3];

    if(!service_modules[stype]){
        return false
    }

    if(service_modules[stype].is_transfer){
        service_modules[stype].on_service_recv_cmd(session, stype, ctype, null, utag, proto_type, cmd_buf);
        return true;
    }
    
    cmd = proto_man.decode_cmd(proto_type, stype, ctype, cmd_buf);
    if(!cmd){
        return false;
    }
    
    body = cmd[2];
    service_modules[stype].on_service_recv_cmd(session, stype, ctype, body, utag, proto_type, null);

    return true;
}

module.exports = service_manager;