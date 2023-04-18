const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js')
const UserStats = require('../src/schemas/userStats');

module.exports.displayName = "Snipe 🎯";
module.exports.description = "Take a deadly shot that is semi inaccurate";
module.exports.mpCost = 5;
module.exports.fileName = "Snipe.js"

module.exports.attackAttackingStat = ["atk"];
module.exports.attackDefendingStat = ["def"];
module.exports.attackAbilityMods = {
    "Clash" : {"MoveMod" : 1.65, "HitMod": 70, "CritMod": 1},
    "Sight" : {"MoveMod" : 1.65, "HitMod": 70, "CritMod": 1},
    "Range" : {"MoveMod" : 1.65, "HitMod": 70, "CritMod": 1},
    "Far" : {"MoveMod" : 1.65, "HitMod": 70, "CritMod": 1},
}

module.exports.targeting = async (interaction, client) => {

    require('../abilityFunctions/abilityCoreFunctions/Attack.js').singleTargeting(interaction, client, this.fileName);

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

    await require('../abilityFunctions/abilityCoreFunctions/Attack.js').execute(interaction, client, this.fileName, desc, curSlot, userTeam, 0);
    
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