var redis = require("redis");
var util = require("util");
var log = require("../utils/log");
var Response = require("../apps/Response");

var redis_client = null;
function connect_to_server(host, port, db_index){
    redis_client = redis.createClient({
        host: host,
        port: port,
        db: db_index
    });

    redis_client.on("error", function(err){
        log.err(err);
    });
}

function set_ugame_inredis(uid, uinfo){
    if(!redis_client){
        return;
    }

    var key = "bycw_game_user_uid_" + uid;
    uinfo.uexp = uinfo.uexp.toString();
    uinfo.uchip = uinfo.uchip.toString();
    uinfo.udata = uinfo.udata.toString();

    log.info("redis_client hmset " + key);

    redis_client.hmset(key, uinfo, function(err){
        if(err){
            log.err(err);
        }
    });
}

module.exports = {
    connect: connect_to_server,
    set_ugame_inredis: set_ugame_inredis,
}