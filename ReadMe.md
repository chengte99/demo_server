1. 建立netbus, 建立tcp & ws server, 並加入session 列表管理.
2. 建立session_enter, session_exit, session_recv, session_send_cmd, session_close
3. 建立proto_man, 建立加密解密func(encrypt&decrypt), 建立編碼解碼func(encode&decode), 根據json & buf 製作編碼解碼func
4. 建立service_manager, 建立service_template服務模塊, register_service, recv_cmd, lost_connect
5. 建立測試服務(talkroom)，走通netbus -> service_manager & proto_man -> talkroom
6. 擴充session, session_send_encode_cmd, session_send_cmd
7. 編寫talkroom服務，走通客戶端與服務端(json)
8. 封裝buf 協議操作，製作proto_tools，走通客戶端與服務端(buf)
9. 加解密獨立出來，修改tcp & ws 啟動時加入is_encrypt
10. 製作網關模式，服務加上is_transfer，加入沒有解碼的raw_cmd，proto_man新增decode_cmd_header，判斷是否為轉發模塊傳body or raw_cmd
11. proto_tools 擴充uint32
12. 為了轉發效能，修改json，body用json，再封裝成buf，讓json&buf協議都是透過buf溝通(不再有str)
13. 網關轉發時需要知道數據包是哪個用戶發過來的，因此修改包頭預留四個字節(utag)，修改proto_tools

14. 配置網關服務，新增Stype.js 管理所有服務。配置game_config.js管理所有連接host,port。編寫gateway.js啟動網關服務器
15. 編寫網關服務（作為client）連接其他服務代碼，另外獨立一個表來記錄網關連到其他服務的session，依stype為key。編寫連接服務時斷線重連機制。

16. service_manager.js新增on_service_return_cmd接收服務回來的命令。在on_player_recv_cmd跟on_service_recv_cmd均加入stype傳遞。
17. service_template.js新增on_service_recv_cmd接收服務回來的命令。去掉寫死stype，在on_player_recv_cmd跟on_service_recv_cmd均加入stype傳遞。去掉init初始化函數，單純把模塊當作處理入口。

18. 新增兩個字節，將proto_type打入buf包內。proto_tools新增write_proto_type_inbuf, write_utag_inbuf。
19. encode編寫打入proto_type到數據包。因proto_type已打入包內，decode_cmd_header已無需透過參數取得proto_type，改寫從包內取得utag, proto_type。一併改寫service_manager的decode_cmd_header、decode_cmd，utag&proto_type加入on_player_recv_cmd跟on_service_recv_cmd一起傳遞。

20. netbus編寫兩個接口，get_client_session跟get_service_session