var log = require("../../utils/log");
var Cmd = require("../Cmd");
var Response = require("../Response");
var mysql_game = require("../../database/mysql_game");
var redis_game = require("../../database/redis_game");
var State = require("./State");

function fish_game_road(index){
    this.road_index = index;
    this.state = State.Road_Idle;
}

module.exports = fish_game_road;