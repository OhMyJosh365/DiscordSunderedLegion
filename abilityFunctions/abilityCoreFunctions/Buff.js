const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js')
const UserStats = require('../../src/schemas/userStats.js');

module.exports.singleTargeting = async (interaction, client, fileReference) => {

    const abilityFile = require(`../${fileReference}`);
    
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

        var curBuff = userProfile.battleState[0].Allies[positions[pos]].battleMods[`${abilityFile.buffStatName[0]}Mod`];
        var bufMod = abilityFile.buffStrength[0];
        var combineBuff = curBuff + bufMod;
        
        if(combineBuff >= 2){
            combineBuff = 2;
        }

        if(userProfile.battleState[0].Allies[positions[pos]].stats.hp > 0){
            options[i++] = {
                label: `${positions[pos]}: ${userProfile.battleState[0].Allies[positions[pos]].info.name}`,
                description: `Buff Increase: ${bufMod * 100}%, Combined Multiplier: ${combineBuff}, Cost: ${abilityFile.mpCost} MP`,
                value: `${positions[pos]}`
            }
        }
    }

    const menu = new SelectMenuBuilder()
    .setPlaceholder(`~ Who should be targeted by ${abilityFile.displayName}?`)
    .setCustomId('targetOptions')
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(options)

    await interaction.editReply({
        components: [new ActionRowBuilder().addComponents(menu)]
    })

}

module.exports.execute = async (interaction, client, fileReference, desc, curSlot, userTeam, abilityIndex) => {

    const abilityFile = require(`../${fileReference}`);
    userProfile = await UserStats.findOne({userId: interaction.user.id});

    var currentTurn = userProfile.battleState[0].Field.curTurn;
    var currentTurn = userProfile.battleState[0].TurnOrder[currentTurn];

    var buffTar = userProfile.battleState[0].Field.curTarget;

    var bufMod = abilityFile.buffStrength[abilityIndex];
    
    userProfile.battleState[0][userTeam][buffTar].battleMods[`${abilityFile.buffStatName[abilityIndex]}Mod`] += bufMod;
    desc[0] += `\n${userProfile.battleState[0][userTeam][`${curSlot}`].info.name} buffed `;
    desc[0] += `${userProfile.battleState[0][userTeam][buffTar].info.name}'s ${abilityFile.buffDisplayName[abilityIndex]} by ${bufMod * 100}%!`;

    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army,
            battleState: userProfile.battleState
        });
}