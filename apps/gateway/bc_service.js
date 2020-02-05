require("./bc_proto");
var gw_service = require("./gw_service");

var service = {
    name: "broadcast service",
    is_transfer: false,

    //收到客戶端給我們的數據
    on_player_recv_cmd: function(session, stype, ctype, body, utag, proto_type, raw_cmd){
        
    },

    //收到我們連接的服務給我們的數據
    on_service_recv_cmd: function(session, stype, ctype, body, utag, proto_type, raw_cmd){
        console.log("bc_service body ...", body);
        var cmd_buf = body.cmd_buf;
        var users = body.users;
        for(var i in users){
            var client_session = gw_service.get_client_session_by_uid(users[i]);
            if(!client_session){
                continue;
            }

            client_session.send_encode_cmd(cmd_buf);
        }
    },

    //收到客戶端斷線
    on_player_disconnect: function(stype, session){
        
    }
}

module.exports = service;
