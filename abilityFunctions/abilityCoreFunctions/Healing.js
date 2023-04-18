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

        if(userProfile.battleState[0].Allies[positions[pos]].stats.hp <= 0){
            continue;
        }
        

        //Calculating Total Healing
        var totalHealing;
            totalHealing = ( userProfile.battleState[0].Allies[curSlot].stats.res *
                    abilityFile.healHealingMod);

            if(totalHealing + userProfile.battleState[0].Allies[positions[pos]].stats[abilityFile.healStatHealed] > 
                userProfile.battleState[0].Allies[positions[pos]].stats[`max${[abilityFile.healStatHealed]}`]){

                    totalHealing = ( userProfile.battleState[0].Allies[positions[pos]].stats[`max${[abilityFile.healStatHealed]}`] -
                        userProfile.battleState[0].Allies[positions[pos]].stats[abilityFile.healStatHealed]);
            }

        totalHealing = Math.floor(totalHealing);


        //Adding Selection to List of Options
        options[i++] = {
            label: `${positions[pos]}: ${userProfile.battleState[0].Allies[positions[pos]].info.name}`,
            description: `Heal Effect: +${totalHealing} ${(abilityFile.healStatHealed)}, ${abilityFile.healStatHealed} After: ${userProfile.battleState[0].Allies[positions[pos]].stats[abilityFile.healStatHealed] + totalHealing}/${userProfile.battleState[0].Allies[positions[pos]].stats[`max${[abilityFile.healStatHealed]}`]}, Cost: ${abilityFile.mpCost} MP`,
            value: `${positions[pos]}`
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
    });

}


module.exports.execute = async (interaction, client, fileReference, desc, curSlot, userTeam, abilityIndex) => {

    const abilityFile = require(`../${fileReference}`);
    userProfile = await UserStats.findOne({userId: interaction.user.id});

    if(!require(`../../passivesAndStatusFunctions/checkForStatuses`).checkForStatuses(userProfile, "overrideHealing", desc)){
            
        var currentTurn = userProfile.battleState[0].Field.curTurn;
        var currentTurn = userProfile.battleState[0].TurnOrder[currentTurn];
        
        var HealTar = userProfile.battleState[0].Field.curTarget;

        var totalHealing;
        totalHealing = ( userProfile.battleState[0].Allies[curSlot].stats.res *
                abilityFile.healHealingMod);

        if(totalHealing + userProfile.battleState[0].Allies[HealTar].stats[abilityFile.healStatHealed[abilityIndex]] > 
            userProfile.battleState[0].Allies[HealTar].stats[`max${[abilityFile.healStatHealed[abilityIndex]]}`]){

                totalHealing = ( userProfile.battleState[0].Allies[HealTar].stats[`max${[abilityFile.healStatHealed[abilityIndex]]}`] -
                    userProfile.battleState[0].Allies[HealTar].stats[abilityFile.healStatHealed[abilityIndex]]);
        }

        totalHealing = Math.floor(totalHealing);
            
        userProfile.battleState[0][userTeam][HealTar].stats[abilityFile.healStatHealed[abilityIndex]] += totalHealing;
        desc[0] += `\n${userProfile.battleState[0][userTeam][`${curSlot}`].info.name} healed ${totalHealing} `;
        desc[0] += `${abilityFile.healStatHealed[abilityIndex]} to ${userProfile.battleState[0][userTeam][HealTar].info.name}!`;
        
    }
    
    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army,
            battleState: userProfile.battleState
        });
}