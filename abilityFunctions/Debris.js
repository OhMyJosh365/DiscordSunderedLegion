const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js')
const UserStats = require('../src/schemas/userStats');

module.exports.displayName = "Debris //";
module.exports.description = "//";
module.exports.mpCost = 50;
module.exports.fileName = "Debris.js";

module.exports.debuffDisplayName = ["Focus"];
module.exports.debuffStatName = ["acc"];
module.exports.debuffStrength = [.1];

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

    for(var i = 0; i < 4; i++){
        userProfile.battleState[0].Field.curTarget = positions[i];
        await UserStats.findOneAndUpdate({userId: interaction.user.id},
            {
                user: userProfile.user,
                army: userProfile.army,
                battleState: userProfile.battleState
            });

        await require('../abilityFunctions/abilityCoreFunctions/Debuff.js').execute(interaction, client, this.fileName, desc, curSlot, userTeam, 0);
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