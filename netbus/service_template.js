var service = {
    name: "service template",
    is_transfer: false,

    //收到客戶端給我們的數據
    on_player_recv_cmd: function(session, stype, ctype, body, utag, proto_type, raw_cmd){

    },

    //收到我們連接的服務給我們的數據
    on_service_recv_cmd: function(session, stype, ctype, body, utag, proto_type, raw_cmd){

    },

    //收到客戶端斷線
    on_player_disconnect: function(session){
        
    }
}

module.exports = service;
