var QuitReason = {
    UserQuit: 0, // 主动离开
	UserLostConn: 1, // 用户掉线
	VipKick: 2, // VIP踢人
    SystemKick: 3, // 系统踢人
    NotEnough: 4, //金幣不足
};

module.exports = QuitReason;