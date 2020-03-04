/*
ENTER_ZONE
客戶端發送
4 1 body = zid (16)
服務端返回
4 1 body = status (16)
*/

/*
USER_QUIT
客戶端發送
4 2 null
服務端返回
4 2 body = status (16)
*/

/*
ENTER_ROOM
服務端發送
4 3 body = {
    0: status, (16)
    1: zid, (16)
    2: room_id, (32)
}
*/

/*
EXIT_ROOM
服務端發送
4 4 body = status (16)
*/

/*
USER_SITDOWN
服務端發送
4 5 body = {
    0: status, (16)
    1: seat_id, (16)
}
*/

/*
USER_STANDUP
服務端發送
4 6 body = {
    0: status, (16)
    1: seat_id, (16)
}
*/

/*
USER_ARRIVED
服務端發送
4 7 body = {
    0: seat_id,
    1: unick,
    2: usex,
    3: uface,
    4: uchip,
    5: uexp,
    6: uvip,
    7: state,
}
*/

/*
SEND_BULLET
客戶端發送
4 8 body = {
    0: seat_id, (16)
    1: level, (16)
    2: road_index (16)
}
服務端發送
4 8 body = {
    0: status, (16)
    1: seat_id, (16)
    2: level, (16)
    3: p.uchip, (16)
    4: damage, (16)
    5: speed, (16)
    6: road_index, (16)
}
*/

/*
PUT_FISH
服務端發送
4 9 body = {
    0: id, (16)
    1: health, (16)
    2: speed, (16)
    3: road_index, (16)
    4: inroom_uid, (32)
    5: create_timestamp (16)
}
*/

/*
DO_READY
客戶端發送
4 10 null
服務端發送
4 10 status
*/

/*
RECOVER_FISH
客戶端發送
4 11 body = {
    0: id, (16)
    1: health, (16)
    2: road_index, (16)
    3: inroom_uid, (32)
    4: seai_id (16)
}
服務端發送
4 11 body = {
    0: status, (16)
    1: seat_id, (16)
    2: road_index, (16)
    3: p.uchip, (16)
}
*/

/*
RECONNECT
服務端發送
4 12 body = {
    0: seat_id, 
    1: arrived_data, 已抵達的座位數據 []
    2: room_id
}
*/