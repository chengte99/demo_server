/*
1. 服務號、命令號、數據
2. 服務號、命令號，都以兩個字節存放
*/
var log = require("../utils/log");
var proto_tools = require("./proto_tools");

var proto_man = {
    PROTO_JSON: 1,
    PROTO_BUF: 2,

    GW_DISCONNECT: 10000,
    
    encrypt_cmd: encrypt_cmd,
    decrypt_cmd: decrypt_cmd,

    decode_cmd_header: decode_cmd_header,
    encode_cmd: encode_cmd,
    decode_cmd: decode_cmd,

    reg_buf_encoder: reg_buf_encoder,
    reg_buf_decoder: reg_buf_decoder,
}

function encrypt_cmd(str_or_buf){
    return str_or_buf;
}

function decrypt_cmd(str_or_buf){
    return str_or_buf;
}

function _json_encode(stype, ctype, body){
    var cmd = {};
    cmd[0] = body;

    var json_str = JSON.stringify(cmd);

    var cmd_buf = proto_tools.encode_str_cmd(stype, ctype, json_str);
    return cmd_buf
}

function _json_decode(cmd_buf){
    var cmd = proto_tools.decode_str_cmd(cmd_buf);
    var json_str = cmd[2];

    try{
        var body = JSON.parse(json_str);
        cmd[2] = body[0];
    }catch(e){
        return null;
    }

    if(!cmd || 
        typeof(cmd[0])=="undefined" || 
        typeof(cmd[1])=="undefined" || 
        typeof(cmd[2])=="undefined"){
        return null;
    }

    return cmd;
}

function encode_cmd(utag, proto_type, stype, ctype, body){
    var cmd_buf = null;
    if(proto_type == proto_man.PROTO_JSON){
        cmd_buf = _json_encode(stype, ctype, body);
    }else{
        var key = get_key(stype, ctype);
        if(!encoders[key]){
            log.error("encoders encode_func is empty, stype: " + stype + ", ctype: " + ctype);
            return null;
        }

        // str_or_buf = encoders[key](body);
        cmd_buf = encoders[key](stype, ctype, body);
    }

    proto_tools.write_utag_inbuf(cmd_buf, utag);
    proto_tools.write_proto_type_inbuf(cmd_buf, proto_type);

    // str_or_buf = encrypt_cmd(str_or_buf);
    return cmd_buf;
}

function decode_cmd_header(cmd_buf){
    if(cmd_buf.length < proto_tools.header_size){
        return null;
    }

    var cmd = {};
    cmd[0] = proto_tools.read_int16(cmd_buf, 0);
    cmd[1] = proto_tools.read_int16(cmd_buf, 2);
    cmd[2] = proto_tools.read_uint32(cmd_buf, 4);
    cmd[3] = proto_tools.read_int16(cmd_buf, 8);

    return cmd;
}

function decode_cmd(proto_type, stype, ctype, cmd_buf){
    // cmd_buf = decrypt_cmd(cmd_buf);
    if(cmd_buf.length < proto_tools.header_size){
        return null;
    }

    var cmd = null;
    if(proto_type == proto_man.PROTO_JSON){
        cmd = _json_decode(cmd_buf);
    }else{
        var key = get_key(stype, ctype);
        if(!decoders[key]){
            log.error("decoders decode_func is empty, stype: " + stype + ", ctype: " + ctype);
            return null;
        }

        cmd = decoders[key](cmd_buf);
    }

    if(cmd){
        return cmd;
    }

    return null;
}

var encoders = {};
var decoders = {};

function get_key(stype, ctype){
    return stype * 65536 + ctype;
}

// encode_func = (body)
function reg_buf_encoder(stype, ctype, encode_func){
    var key = get_key(stype, ctype);
    if(encoders[key]){
        log.warn("encoders stype: " + stype + ", ctype: " + ctype + " is reged !");
        return null;
    }

    encoders[key] = encode_func;
}

// decode_func = (buf)
function reg_buf_decoder(stype, ctype, decode_func){
    var key = get_key(stype, ctype);
    if(decoders[key]){
        log.warn("decoders stype: " + stype + ", ctype: " + ctype + " is reged !");
        return null;
    }

    decoders[key] = decode_func;
}


module.exports = proto_man;