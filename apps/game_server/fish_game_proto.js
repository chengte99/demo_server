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
}
*/

/*
SEND_BULLET
客戶端發送
4 8 body = {
    0: seat_id, (16)
    1: level, (16)
}
服務端發送
4 8 body = {
    0: status, (16)
    1: seat_id, (16)
    2: level, (16)
    3: cost, (16)
    4: damage, (16)
    5: speed, (16)
}
*/