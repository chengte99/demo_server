/*
ENTER_ZONE
客戶端發送
4 1 body = zid
服務端返回
4 1 body = status
*/

/*
USER_QUIT
客戶端發送
4 2 null
服務端返回
4 2 body = status
*/

/*
ENTER_ROOM
客戶端發送 (指定房號)
4 3 body = room_id (32)
服務端返回
4 3 body = {
    0: status,
    1: zid,
    2: room_id
}
*/

/*
EXIT_ROOM
客戶端發送
4 4 null
服務端返回
4 4 body = status
*/

/*
USER_SITDOWN
客戶端發送 (手動坐下)
4 5 body = seat_id (16)
服務端返回
4 5 body = {
    0: status,
    1: seat_id,
}
*/

/*
USER_STANDUP
客戶端發送 (手動站起)
4 6 body = null
服務端返回
4 6 body = {
    0: status,
    1: seat_id,
}
*/