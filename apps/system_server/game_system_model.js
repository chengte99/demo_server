
var utils = require("../../utils/utils");
var Response = require("../Response");
var mysql_game = require("../../database/mysql_game");
var redis_game = require("../../database/redis_game");
var log = require("../../utils/log");
var game_config = require("../game_config");

function write_err(status, ret_func){
    var ret = {};
    ret.status = status;
    ret_func(ret);
}

function get_game_info_success(data, ret_func){
    var ret = {};
    ret.status = Response.OK;
    ret.uexp = data.uexp;
    ret.uchip = data.uchip;
    ret.udata = data.udata;

    redis_game.set_ugame_inredis(data.uid, {
        uexp: data.uexp,
        uchip: data.uchip,
        udata: data.udata,
    });

    ret_func(ret);
}

function get_game_info(uid, ret_func){
    mysql_game.get_game_info_by_uid(uid, function(status, sql_result){
        if(status != Response.OK){
            write_err(status, ret_func);
            return;
        }

        if(sql_result.length <= 0){
            mysql_game.insert_game_info_by_uid(uid, game_config.ugame_config.first_uexp, game_config.ugame_config.first_uchip, function(status, sql_result){
                if(status != Response.OK){
                    write_err(status, ret_func);
                    return;
                }

                get_game_info(uid, ret_func);
            })
        }else{
            var data = sql_result[0];
            
            if(data.status != 1){
                write_err(Response.ILLEGAL_ACCOUNT, ret_func);
                return;
            }

            get_game_info_success(data, ret_func);
        }
    })
}

module.exports = {
    get_game_info: get_game_info,
}