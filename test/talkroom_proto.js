var proto_man = require("../netbus/proto_man");
var proto_tools = require("../netbus/proto_tools");
/*
Enter
客戶端發送
1, 1, body = {
    uname: "xxx",
    usex: 1 or 0
}
服務端返回:
1, 1, response

Exit
客戶端發送
1, 2, null
服務端返回:
1, 2, response

UserArrived
服務端發送:
1, 3, body = {
    uname: "xxx",
    usex: 1 or 0
}

UserExit
服務端發送:
1, 4, body = {
    uname: "xxx",
    usex: 1 or 0
}

SendMsg
客戶端發送
1, 5, body = msg
服務端返回:
1, 5, body = {
    0: response,
    1: uname,
    2: usex,
    3: msg
}

UserMsg
服務端發送:
1, 6, body = {
    0: uname,
    1: usex,
    2: msg
}
*/

function decode_enter_talkroom(cmd_buf){
    var cmd = {};
    cmd[0] = proto_tools.read_int16(cmd_buf, 0);
    cmd[1] = proto_tools.read_int16(cmd_buf, 2);
    var body = {};
    cmd[2] = body;

    var ret = proto_tools.read_str_inbuf(cmd_buf, proto_tools.header_size);
    body.uname = ret[0];
    var offset = ret[1];
    body.usex = proto_tools.read_int16(cmd_buf, offset);
    offset += 2;

    return cmd;
}

function encode_user_enter_talkroom(stype, ctype, body){
    var uname_len = body.uname.utf8_byte_len();
    var total_len = proto_tools.header_size + 2 + uname_len + 2;
    var cmd_buf = proto_tools.allocBuffer(total_len);
    var offset = proto_tools.write_head_inbuf(cmd_buf, stype, ctype);
    offset = proto_tools.write_str_inbuf(cmd_buf, offset, body.uname, uname_len);
    proto_tools.write_int16(cmd_buf, offset, body.usex);
    offset += 2;

    return cmd_buf;
}

function encode_user_exit_talkroom(stype, ctype, body){
    var uname_len = body.uname.utf8_byte_len();
    var total_len = proto_tools.header_size + 2 + uname_len + 2;
    var cmd_buf = proto_tools.allocBuffer(total_len);
    var offset = proto_tools.write_head_inbuf(cmd_buf, stype, ctype);
    offset = proto_tools.write_str_inbuf(cmd_buf, offset, body.uname, uname_len);
    proto_tools.write_int16(cmd_buf, offset, body.usex);
    offset += 2;

    return cmd_buf;
}

function encode_send_msg(stype, ctype, body){
    var uname_len = body[1].utf8_byte_len();
    var msg_len = body[3].utf8_byte_len();
    var total_len = proto_tools.header_size + 2 + 2 + uname_len + 2 + 2 + msg_len;
    var cmd_buf = proto_tools.allocBuffer(total_len);
    var offset = proto_tools.write_head_inbuf(cmd_buf, stype, ctype);
    proto_tools.write_int16(cmd_buf, offset, body[0]);
    offset += 2;
    offset = proto_tools.write_str_inbuf(cmd_buf, offset, body[1], uname_len);
    proto_tools.write_int16(cmd_buf, offset, body[2]);
    offset += 2;
    offset = proto_tools.write_str_inbuf(cmd_buf, offset, body[3], msg_len);

    return cmd_buf;
}

function encode_user_msg(stype, ctype, body){
    var uname_len = body[0].utf8_byte_len();
    var msg_len = body[2].utf8_byte_len();
    var total_len = proto_tools.header_size + 2 + uname_len + 2 + 2 + msg_len;
    var cmd_buf = proto_tools.allocBuffer(total_len);
    var offset = proto_tools.write_head_inbuf(cmd_buf, stype, ctype);
    offset = proto_tools.write_str_inbuf(cmd_buf, offset, body[0], uname_len);
    proto_tools.write_int16(cmd_buf, offset, body[1]);
    offset += 2;
    offset = proto_tools.write_str_inbuf(cmd_buf, offset, body[2], msg_len);

    return cmd_buf;
}

proto_man.reg_buf_decoder(1, 1, decode_enter_talkroom);
proto_man.reg_buf_encoder(1, 1, proto_tools.encode_status_cmd);

proto_man.reg_buf_decoder(1, 2, proto_tools.decode_empty_cmd);
proto_man.reg_buf_encoder(1, 2, proto_tools.encode_status_cmd);

proto_man.reg_buf_encoder(1, 3, encode_user_enter_talkroom);
proto_man.reg_buf_encoder(1, 4, encode_user_exit_talkroom);

proto_man.reg_buf_decoder(1, 5, proto_tools.decode_str_cmd);
proto_man.reg_buf_encoder(1, 5, encode_send_msg);

proto_man.reg_buf_encoder(1, 6, encode_user_msg);