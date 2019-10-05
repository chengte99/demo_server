0. npm install express, ws, mysql, redis
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
21. 編寫gw_service，送給服務時打入utag，收到服務回傳時清除utag。
22. 修改talkroom符合網關轉發模式，修改netbus的send_cmd都帶上utag、proto_type，修改proto_man的encode都帶上utag、proto_type並打入cmd_buf。
23. 編寫用戶被迫斷線命令，編寫gw_service的on_player_disconnect斷線機制，增加GW_DISCONNECT，talkroom增加接收GW_DISCONNECT判斷。
24. 修改gateway，在連接每個服務時均註冊gw_service。
25. 因proto_type已改成打入cmd_buf包內，不在需要從session.proto_type取得，檢查並刪除有關session.proto_type的代碼。且修改netbus的start_tcp_server、start_ws_server，不在需要傳proto_type。

26. 建立center_server, game_config配置center_server_config, 建立auth_service。建立Cmd，將GW_DISCONNECT移到Cmd。
27. 創建mysql table，編寫mysql_center代碼並在center_server時連接數據庫。
28. 客戶端編寫遊客登陸時從ugame取得guest_key，沒有則隨機生成32位key。編寫遊客登陸相關代碼、mysql代碼。走通遊客登陸流程，客戶端保存ukey以便下次登陸。

29. 修改gw_service，utag根據未登入與已登入分別用session_key與uid，修改on_player_recv_cmd & on_service_recv_cmd。
30. 建立session & uid 對應表，編寫save_uid_session_map & get_client_session_by_uid接口，登入成功寫入對應表，後續非登入命令使用uid從對應表取得client_session。
31. 登入成功後判斷先前是否已登入過，重複登入。若有則發送重複登入命令並關閉該session。
32. 當用戶斷線on_player_disconnect，判斷服務Auth時，清除uid & session對應表。修改on_player_disconnect直接傳入uid，service_manager的on_client_lost_connect 判斷uid為0直接return，無需通知服務。

