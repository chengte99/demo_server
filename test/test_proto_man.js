var log = require("../utils/log");
var proto_man = require("../netbus/proto_man");

var data = {
    "uname": "kevin",
    "upwd": "asd123",
}

// JSON ====================================================================
var buf = proto_man.encode_cmd(proto_man.PROTO_JSON, 1, 1, data);
log.info(buf);
log.error("JSON buf length: ", buf.length);

var cmd = proto_man.decode_cmd(proto_man.PROTO_JSON, buf);
log.info(cmd);

// BUF ====================================================================

function encode_buf1_1(body){
    var total_len = 2 + 2 + 2 + body.uname.length + 2 + body.upwd.length;
    var buf = Buffer.allocUnsafe(total_len);

    buf.writeUInt16LE(1, 0);
    buf.writeUInt16LE(1, 2);
    buf.writeUInt16LE(body.uname.length, 4);
    buf.write(body.uname, 6, body.uname.length, "utf8");

    var offset = 6 + body.uname.length;
    buf.writeUInt16LE(body.upwd.length, offset);
    buf.write(body.upwd, offset + 2, body.upwd.length, "utf8");

    return buf;
}

function decode_buf1_1(buf){
    var cmd = {};
    cmd[0] = buf.readUInt16LE(0);
    cmd[1] = buf.readUInt16LE(2);
    var body = {};
    cmd[2] = body;

    var uname_len = buf.readUInt16LE(4);
    if((2 + 2 + 2 + uname_len) > buf.length){
        log.error("buf decode failed !");
        return null;
    }

    body.uname = buf.toString("utf8", 6, 6 + uname_len);

    var offset = 6 + uname_len;
    var upwd_len = buf.readUInt16LE(offset);
    if((2 + 2 + 2 + uname_len + 2 + upwd_len) > buf.length){
        log.error("buf decode failed !");
        return null;
    }

    body.upwd = buf.toString("utf8", offset + 2, offset + 2 + upwd_len);

    return cmd;
}

proto_man.reg_encode_buf(1, 1, encode_buf1_1);
proto_man.reg_decode_buf(1, 1, decode_buf1_1);

var buf = proto_man.encode_cmd(proto_man.PROTO_BUF, 1, 1, data);
log.info(buf);
log.error("JSON buf length: ", buf.length);

var cmd = proto_man.decode_cmd(proto_man.PROTO_BUF, buf);
log.info(cmd);