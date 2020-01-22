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

        fish_game_zone: {
            0: {zid: 1, name: "初級場", enter_vip: 0, chip: 1000, one_round_chip: 20, think_time: 15},
            1: {zid: 2, name: "高級場", enter_vip: 0, chip: 2000, one_round_chip: 20, think_time: 15},
        },

        bullet_level: {
            0: {level: 1, cost: 10, damage: 5, speed: 400},
            1: {level: 2, cost: 20, damage: 10, speed: 400},
        }
    }
}

module.exports = game_config;