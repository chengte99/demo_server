var Stype = require("./Stype");

var game_config = {
    gateway_config: {
        host: "127.0.0.1",
        ports: [6080, 6081, 6082, 6083],
    },

    talkroom_config: {
        host: "127.0.0.1",
        port: 6084,
    },

    gateway_connect_service_config:{
        0: {
            stype: Stype.TalkRoom,
            host: "127.0.0.1",
            port: 6084,
        },
        1: {
            stype: Stype.Login,
            host: "127.0.0.1",
            port: 6086,
        }
    }
}

module.exports = game_config;