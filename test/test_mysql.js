var mysql = require("mysql");

var pool = mysql.createPool({
    host: "127.0.0.1",
    port: 3306,
    database: "mytest_database",
    user: "root",
    password: "asd12345"
});

//callback = (err, sql_result, fields_desc)
function mysql_exec(sql, callback){
    pool.getConnection(function(err, conn){
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

var sql = "select * from uinfo where id = 3";
mysql_exec(sql, function(err, sql_result, fields_desc){
    if(err){
        console.log("error: ", err);
        return;
    }

    console.log(sql_result);
});