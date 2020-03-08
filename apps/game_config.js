var Stype = require("./Stype");
var HOST_IP = "127.0.0.1";

var game_config = {
    GATEWAY_CONNECT_IP: "47.92.0.77",

    gateway_config: {
        host: "HOST_IP",
        ports: [6080, 6081],
    },

    center_server_config: {
        host: "HOST_IP",
        port: 6086,
        stypes: [Stype.Auth],
    },

    system_server_config: {
        host: "HOST_IP",
        port: 6087,
    },

    game_server_config: {
        host: "HOST_IP",
        port: 6088,
    },

    webserver_config: {
        host: "HOST_IP",
        port: 10001,
    },

    talkroom_config: {
        host: "HOST_IP",
        port: 6084,
    },

    center_database: {
        host: "HOST_IP",
        port: 3306,
        user: "root",
        // password: "asd12345",
        // database: "bycw_center_p",
        database: "fish_center",
        password: "ZAQ!xsw2"
    },

    game_database: {
        host: "HOST_IP",
        port: 3306,
        user: "root",
        // password: "asd12345",
        // database: "bycw_game_p",
        database: "fish_game",
        password: "ZAQ!xsw2"
    },

    center_redis: {
        host: "HOST_IP",
        port: 6379,
        db_index: 0,
    },

    game_redis: {
        host: "HOST_IP",
        port: 6379,
        db_index: 1,
    },

    game_servers:{
        // 0: {
        //     stype: Stype.TalkRoom,
        //     host: "HOST_IP",
        //     port: 6084,
        // },
        1: {
            stype: Stype.Auth,
            host: "HOST_IP",
            port: 6086,
        },
        2: {
            stype: Stype.GameSystem,
            host: "HOST_IP",
            port: 6087,
        },
        3: {
            stype: Stype.FishGame,
            host: "HOST_IP",
            port: 6088,
        }
    },

    ugame_config: {
        first_uexp: 1000,
        first_uchip: 20000,

        fish_game_zone: {
            0: {zid: 1, name: "初級場", enter_vip: 0, chip: 1000, one_round_chip: 20, think_time: 15},
            1: {zid: 2, name: "高級場", enter_vip: 0, chip: 2000, one_round_chip: 20, think_time: 15},
        },

        fish_game_fish_type_max: 6,
        fish_game_fish_type: {
            0: {id: 1, health: 30, speed: 50},
            1: {id: 2, health: 50, speed: 100},
            2: {id: 3, health: 80, speed: 50},
            3: {id: 4, health: 100, speed: 50},
            4: {id: 5, health: 120, speed: 50},
            5: {id: 6, health: 150, speed: 50},
        },

        bullet_level: {
            0: {level: 1, cost: 10, damage: 5, speed: 400},
            1: {level: 2, cost: 20, damage: 10, speed: 400},
        }
    }
}

module.exports = game_config;