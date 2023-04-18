const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const UserStats = require('../src/schemas/userStats');

module.exports.displayName = "Reversal //";
module.exports.description = "//";
module.exports.mpCost = 50;
module.exports.fileName = "Reversal.js"

module.exports.buffDisplayName = ["Magic"];
module.exports.buffStatName = ["mag"];
module.exports.buffStrength = [1];

module.exports.targeting = async (interaction, client) => {
    
    userProfile = await UserStats.findOne({userId: interaction.user.id});

    var currentTurn = userProfile.battleState[0].Field.curTurn;
    var currentTurn = userProfile.battleState[0].TurnOrder[currentTurn];
    var curSlot;
    for(var ally in userProfile.battleState[0].Allies){
        if(userProfile.battleState[0].Allies[ally].battleMods.battleID == currentTurn){
            curSlot = ally;
            break;
        }
    }
    
    var i = 0;
    var options = [];
    var positions = ["Clash", "Sight", "Range", "Far"];

    for(var pos in positions){

        var curBuff = userProfile.battleState[0].Allies[positions[pos]].battleMods[`${this.buffStatName[0]}Mod`];
        var bufMod = this.buffStrength[0];

        var listOfStats = ["atk", "def", "mag", "res", "spd", "acc"];
    
        for(var j = 0; j < 6; j++){
            if(bufMod > userProfile.battleState[0]["Allies"][positions[pos]].battleMods[`${listOfStats[j]}Mod`]){
                bufMod = userProfile.battleState[0]["Allies"][positions[pos]].battleMods[`${listOfStats[j]}Mod`];
            }
        }
        bufMod = 1 - bufMod;

        var combineBuff = curBuff + bufMod;
        
        if(combineBuff >= 2){
            combineBuff = 2;
        }

        if(userProfile.battleState[0].Allies[positions[pos]].stats.hp > 0){
            options[i++] = {
                label: `${positions[pos]}: ${userProfile.battleState[0].Allies[positions[pos]].info.name}`,
                description: `Buff Increase: ${bufMod * 100}%, Combined Multiplier: ${combineBuff}, Cost: ${this.mpCost} MP`,
                value: `${positions[pos]}`
            }
        }
    }

    const menu = new SelectMenuBuilder()
    .setPlaceholder(`~ Who should be targeted by ${this.displayName}?`)
    .setCustomId('targetOptions')
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(options)

    await interaction.update({
        components: [new ActionRowBuilder().addComponents(menu)]
    })

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

    var buffTar = userProfile.battleState[0].Field.curTarget;
    var buffMod = this.buffStrength[0];

    var listOfStats = ["atk", "def", "mag", "res", "spd", "acc"];
    
    for(var i = 0; i < 6; i++){
        if(buffMod > userProfile.battleState[0][userTeam][buffTar].battleMods[`${listOfStats[i]}Mod`]){
            buffMod = userProfile.battleState[0][userTeam][buffTar].battleMods[`${listOfStats[i]}Mod`];
        }
    }
    buffMod = 1 - buffMod;
    
    userProfile.battleState[0][userTeam][buffTar].battleMods[`${this.buffStatName[0]}Mod`] += buffMod;
    desc[0] += `\n${userProfile.battleState[0][userTeam][`${curSlot}`].info.name} buffed `;
    desc[0] += `${userProfile.battleState[0][userTeam][buffTar].info.name}'s ${this.buffDisplayName[0]} by ${buffMod * 100}%!`;
    
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