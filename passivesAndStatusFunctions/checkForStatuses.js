const mongoose = require("mongoose");
const UserStats = require('../src/schemas/userStats');
const { EmbedBuilder, REST } = require("discord.js");

module.exports.checkForStatuses = async(userProfile, functionCheck, desc = [], extraData = []) => {
    
    var active = false;
    var teamList = ["Allies", "Enemies"];
    var slotList = ["Clash", "Sight", "Range", "Far"];
    for(var team in teamList){
        for(var slot in slotList){
            for(var condition in userProfile.battleState[0][teamList[team]][slotList[slot]].battleMods.conditions){
                var status = require(`./${userProfile.battleState[0][teamList[team]][slotList[slot]].battleMods.conditions[condition].Status}`);
                console.log(userProfile.battleState[0][teamList[team]][slotList[slot]].battleMods.conditions);

                if(status[functionCheck] && userProfile.battleState[0][teamList[team]][slotList[slot]].stats.hp > 0){
                    if(status[functionCheck](userProfile, teamList[team], slotList[slot], condition, desc, extraData) != false)
                        active = true;
                }

            }
        }
    }
    return active;

}