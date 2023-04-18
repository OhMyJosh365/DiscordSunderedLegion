const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js')
const UserStats = require('../src/schemas/userStats');

module.exports.displayName = "Rumble //";
module.exports.description = "//";
module.exports.mpCost = 5;
module.exports.fileName = "Rumble.js"

module.exports.attackAttackingStat = ["atk"];
module.exports.attackDefendingStat = ["def"];
module.exports.attackAbilityMods = {
    "Clash" : {"MoveMod" : 1.4, "HitMod": 70, "CritMod": 1},
    "Sight" : {"MoveMod" : 1.4, "HitMod": 1000, "CritMod": 1},
    "Range" : {"MoveMod" : 1.4, "HitMod": 1000, "CritMod": 1},
    "Far" : {"MoveMod" : 1.4, "HitMod": 1000, "CritMod": 1},
}

module.exports.targeting = async (interaction, client) => {

    this.execut(interaction, client);

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
    var desc = [`${userProfile.battleState[0][userTeam][`${curSlot}`].info.name} used ${this.displayName}!`];
    var positions = ["Clash", "Sight", "Range", "Far"];
    var flag = true;

    for(var i = 0; i < 4 && flag; i++){
        userProfile.battleState[0].Field.curTarget = positions[i];
        await UserStats.findOneAndUpdate({userId: interaction.user.id},
            {
                user: userProfile.user,
                army: userProfile.army,
                battleState: userProfile.battleState
            });

            flag = await require('./abilityCoreFunctions/Attack.js').execute(interaction, client, this.fileName, desc, curSlot, userTeam, 0);
            
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