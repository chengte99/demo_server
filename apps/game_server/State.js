var State = {
    InView: 0, //只適合玩家
    Ready: 1, //準備
    Playing: 2, //遊戲中
    Checkout: 3, //遊戲結算
    Road_Idle: 4, // road 閒置中
    Road_Useing: 5, // road 使用中
}

module.exports = State;