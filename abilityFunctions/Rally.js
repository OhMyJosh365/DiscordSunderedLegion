const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const UserStats = require('../src/schemas/userStats');

module.exports.displayName = "Rally 📯";
module.exports.description = "Cheers on an ally, buffing thier Attack.";
module.exports.mpCost = 5;
module.exports.fileName = "Rally.js";

module.exports.buffDisplayName = ["Attack"];
module.exports.buffStatName = ["atk"];
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