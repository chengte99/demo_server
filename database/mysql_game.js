var mysql = require("mysql");
var util = require("util");
var log = require("../utils/log");
var Response = require("../apps/Response");

var conn_pool = null;
function connect_to_server(host, port, user, pwd, database){
    conn_pool = mysql.createPool({
        host: host,
        port: port,
        database: database,
        user: user,
        password: pwd,
    });
}

function mysql_exec(sql, callback){
    conn_pool.getConnection(function(err, conn){
        if(err){
            if(callback){
                callback(err, null, null);
                return;
            }
        }

        conn.query(sql, function(sql_err, sql_result, fields_desc){
            conn.release();

            if(sql_err){
                if(callback){
                    callback(sql_err, null, null);
                    return;
                }
            }

            if(callback){
                callback(null, sql_result, fields_desc);
            }
        });
    });
}

function get_game_info_by_uid(uid, callback){
    var sql = "select * from ugame where uid = %d";
    var sql_cmd = util.format(sql, uid);
    log.info(sql_cmd);

    mysql_exec(sql_cmd, function(sql_err, sql_result, fields_desc){
        if(sql_err){
            callback(Response.SYSTEM_ERROR, null);
            return;
        }

        callback(Response.OK, sql_result);
    })
}

function insert_game_info_by_uid(uid, uexp, uchip, callback){
    var sql = "insert into ugame (`uid`, `uexp`, `uchip`) values (%d, %d, %d)";
    var sql_cmd = util.format(sql, uid, uexp, uchip);
    log.info(sql_cmd);

    mysql_exec(sql_cmd, function(sql_err, sql_result, fields_desc){
        if(sql_err){
            callback(Response.SYSTEM_ERROR, null);
            return;
        }

        callback(Response.OK, null);
    })
}

function update_game_info_uchip_by_uid(uid, bonus, is_add, callback){
    if(!is_add){
        bonus = -bonus;
    }
    var sql = "update ugame set uchip = uchip + %d where uid = %d";
    var sql_cmd = util.format(sql, bonus, uid);
    log.info(sql_cmd);

    mysql_exec(sql_cmd, function(err, sql_result, fields_desic){
        if(err){
            callback(Response.SYS_ERROR);
            return;
        }

        callback(Response.OK);
    })
}

function update_game_info_by_uid(uid, uexp, uchip, uvip, callback){
    var sql = "update ugame set uexp = %d, uchip = %d, uvip = %d where uid = %d";
    var sql_cmd = util.format(sql, uexp, uchip, uvip, uid);
    log.info(sql_cmd);

    mysql_exec(sql_cmd, function(err, sql_result, fields_desic){
        if(err){
            callback(Response.SYS_ERROR);
            return;
        }

        callback(Response.OK);
    })
}

module.exports = {
    connect: connect_to_server,
    get_game_info_by_uid: get_game_info_by_uid,
    insert_game_info_by_uid: insert_game_info_by_uid,
    update_game_info_by_uid: update_game_info_by_uid,
}