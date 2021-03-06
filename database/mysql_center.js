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

function get_guest_uinfo_by_ukey(ukey, callback){
    var sql = "select * from uinfo where guest_key = \"%s\" and status = 1";
    var sql_cmd = util.format(sql, ukey);
    log.info(sql_cmd);

    mysql_exec(sql_cmd, function(sql_err, sql_result, fields_desc){
        if(sql_err){
            callback(Response.SYSTEM_ERROR, null);
            return;
        }

        callback(Response.OK, sql_result);
    })
}

function insert_guest_uinfo_by_ukey(unick, ukey, callback){
    var sql = "insert into uinfo (`unick`, `guest_key`) values (\"%s\", \"%s\")";
    var sql_cmd = util.format(sql, unick, ukey);
    log.info(sql_cmd);

    mysql_exec(sql_cmd, function(sql_err, sql_result, fields_desc){
        if(sql_err){
            callback(Response.SYSTEM_ERROR, null);
            return;
        }

        callback(Response.OK, null);
    })
}

module.exports = {
    connect: connect_to_server,
    get_guest_uinfo_by_ukey: get_guest_uinfo_by_ukey,
    insert_guest_uinfo_by_ukey: insert_guest_uinfo_by_ukey,
}