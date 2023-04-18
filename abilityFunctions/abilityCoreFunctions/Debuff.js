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

        var curBuff = userProfile.battleState[0].Enemies[positions[pos]].battleMods[`${abilityFile.debuffStatName}Mod`];
        var bufMod = abilityFile.debuffStrength;
        var combineBuff = curBuff - bufMod;
        
        if(combineBuff <= .01){
            combineBuff = .01;
        }

        if(userProfile.battleState[0].Enemies[positions[pos]].stats.hp > 0){
            options[i++] = {
                label: `${positions[pos]}: ${userProfile.battleState[0].Enemies[positions[pos]].info.name}`,
                description: `Debuff Decrease: ${bufMod * 100}%, Combined Multiplier: ${combineBuff}, Cost: ${abilityFile.mpCost} MP`,
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
    var targetTeam = (userTeam === "Allies" ? "Enemies" : "Allies");

    var enemyTar = userProfile.battleState[0].Field.curTarget;

    var bufMod = abilityFile.debuffStrength[abilityIndex];
    var curBuff = userProfile.battleState[0][targetTeam][enemyTar].battleMods[`${abilityFile.debuffStatName}Mod`];
    var combineBuff = curBuff - bufMod;
    
    if(combineBuff <= .01){
        combineBuff = .01;
    }
    
    userProfile.battleState[0][targetTeam][enemyTar].battleMods[`${abilityFile.debuffStatName}Mod`] = combineBuff;
    desc[0] += `\n${userProfile.battleState[0][userTeam][`${curSlot}`].info.name} debuffed `;
    desc[0] += `${userProfile.battleState[0][targetTeam][enemyTar].info.name}'s ${abilityFile.debuffDisplayName} by ${bufMod * 100}%!`;
    
    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army,
            battleState: userProfile.battleState
        });
}