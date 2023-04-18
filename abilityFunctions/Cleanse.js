const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const UserStats = require('../src/schemas/userStats');

module.exports.displayName = "Cleanse 🧼";
module.exports.description = "//";
module.exports.mpCost = 5;
module.exports.fileName = "Cleanse.js";

module.exports.statusName = ["Cleanse"];
module.exports.statusTime = [-1];
module.exports.statusHitRate = [100];
module.exports.statusTeamTar = ["Allies"];


module.exports.targeting = async (interaction, client) => {

    require('./abilityCoreFunctions/Status.js').singleTargeting(interaction, client, this.fileName);
    
}

module.exports.execut = async (interaction, client) => {

    userProfile = await UserStats.findOne({userId: interaction.user.id});

    var currentTurn = userProfile.battleState[0].Field.curTurn;
    var currentTurn = userProfile.battleState[0].TurnOrder[currentTurn];
    var userTeam = (currentTurn <= 4 ? "Allies" : "Enemies");

    var curSlot;
    for(var ally in userProfile.battleState[0][userTeam]){
        if(userProfile.battleState[0][userTeam][ally].battleMods.battleID == currentTurn){
            curSlot = ally;
            break;
        }
    }
    var target = userProfile.battleState[0].Field.curTarget;

    var desc = [`${userProfile.battleState[0][userTeam][`${curSlot}`].info.name} used ${this.displayName}!`];
    var loopFlag = true;

    for(var condition in userProfile.battleState[0][userTeam][target].battleMods.conditions && loopFlag){
        var status = require(`../passivesAndStatusFunctions/${userProfile.battleState[0][userTeam][target].battleMods.conditions[condition].Status}`);
        
        if(loopFlag && (status.displayName == "Burn" || status.displayName == "Bleed" || status.displayName == "Fear"
            || status.displayName == "Poison" || status.displayName == "Prone" || status.displayName == "Shock"
            || status.displayName == "Stun" || status.displayName == "Immobilized")){
                userProfile.battleState[0][userTeam][target].battleMods.conditions.splice(condition);
                loopFlag = false;
        }
    }

    userProfile.battleState[0][userTeam][`${curSlot}`].stats.mp -= this.mpCost;
    if(userProfile.battleState[0][userTeam][curSlot].stats.mp <= 0){
        userProfile.battleState[0][userTeam][curSlot].stats.mp = 0;
    }

    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army,
            battleState: userProfile.battleState
        });
    
    client.settingUpActionPrinting(interaction, client, desc, curSlot, userTeam);
    
}