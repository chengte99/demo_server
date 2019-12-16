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

    system_server_config: {
        host: "127.0.0.1",
        port: 6087,
    },

    game_server_config: {
        host: "127.0.0.1",
        port: 6088,
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

    game_database: {
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "asd12345",
        database: "bycw_game_p",
    },

    center_redis: {
        host: "127.0.0.1",
        port: 6379,
        db_index: 0,
    },

    game_redis: {
        host: "127.0.0.1",
        port: 6379,
        db_index: 1,
    },

    game_servers:{
        // 0: {
        //     stype: Stype.TalkRoom,
        //     host: "127.0.0.1",
        //     port: 6084,
        // },
        1: {
            stype: Stype.Auth,
            host: "127.0.0.1",
            port: 6086,
        },
        2: {
            stype: Stype.GameSystem,
            host: "127.0.0.1",
            port: 6087,
        },
        3: {
            stype: Stype.FishGame,
            host: "127.0.0.1",
            port: 6088,
        }
    },

    ugame_config: {
        first_uexp: 1000,
        first_uchip: 1000,

    }
}

module.exports = game_config;