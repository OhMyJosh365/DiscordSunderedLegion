const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const UserStats = require('../src/schemas/userStats');

module.exports.displayName = "Encourage //";
module.exports.description = "Encourage an ally, buffing thier speed";
module.exports.mpCost = 5;
module.exports.fileName = "Encourage.js";

module.exports.buffDisplayName = ["Spped"];
module.exports.buffStatName = ["spd"];
module.exports.buffStrength = [.2];


module.exports.targeting = async (interaction, client) => {

    require('../abilityFunctions/abilityCoreFunctions/Buff.js').singleTargeting(interaction, client, this.fileName);
    
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

    await require('../abilityFunctions/abilityCoreFunctions/Buff.js').execute(interaction, client, this.fileName, desc, curSlot, userTeam, 0);
    
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