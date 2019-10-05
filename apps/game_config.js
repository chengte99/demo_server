var Stype = require("./Stype");

var game_config = {
    gateway_config: {
        host: "127.0.0.1",
        ports: [6080, 6081],
    },

    center_server_config: {
        host: "127.0.0.1",
        port: 6086,
        stypes: [Stype.Auth],
    },

    talkroom_config: {
        host: "127.0.0.1",
        port: 6084,
    },

    center_database: {
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "asd12345",
        database: "bycw_center_p",
    },

    game_servers:{
        0: {
            stype: Stype.TalkRoom,
            host: "127.0.0.1",
            port: 6084,
        },
        1: {
            stype: Stype.Auth,
            host: "127.0.0.1",
            port: 6086,
        }
    }
}

module.exports = game_config;