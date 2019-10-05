var utils = require("../../utils/utils");
var Response = require("../Response");
var mysql_center = require("../../database/mysql_center");
var log = require("../../utils/log");

function write_err(status, ret_func){
    var ret = {};
    ret.status = status;
    ret_func(ret);
}

function quest_login_success(data, ret_func){
    var ret = {};
    ret.status = Response.OK;
    ret.uid = data.uid;
    ret.unick = data.unick;
    ret.usex = data.usex;
    ret.uface = data.uface;
    ret.uvip = data.uvip;
    ret.guest_key = data.guest_key;
    ret_func(ret);
}

function quest_login(ukey, ret_func){

    mysql_center.get_guest_uinfo_by_ukey(ukey, function(status, sql_result){
        if(status != Response.OK){
            write_err(status, ret_func);
            return;
        }

        // log.info(sql_result);
        if(sql_result.length <= 0){
            //註冊一個
            var unick = "遊客" + utils.random_int_str(6);
            var usex = utils.random_int(0, 1);
            var uface = 0; //系統默認

            mysql_center.insert_guest_uinfo_by_ukey(unick, ukey, function(status, sql_result){
                if(status != Response.OK){
                    write_err(status, ret_func);
                    return;
                }
                
                //註冊完再跑一次取的用戶資訊
                quest_login(ukey, ret_func);
            });
        }else{
            var data = sql_result[0];
            if(data.status != 1){
                write_err(Response.ILLEGAL_ACCOUNT, ret_func);
                return;
            }

            if(data.is_guest != 1){
                write_err(Response.INVALID_OPT, ret_func);
                return;
            }
            quest_login_success(data, ret_func);
        }
    });
}

module.exports = {
    quest_login: quest_login,
}