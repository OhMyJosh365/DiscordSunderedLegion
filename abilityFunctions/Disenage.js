const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const UserStats = require('../src/schemas/userStats');

module.exports.displayName = "Disenage //";
module.exports.description = "//";
module.exports.mpCost = 5;
module.exports.fileName = "Disenage.js";

module.exports.statusName = ["Disenaged"];
module.exports.statusTime = [2];
module.exports.statusHitRate = [100];
module.exports.statusTeamTar = ["Allies"];


module.exports.targeting = async (interaction, client) => {

    var options = [];
        
    options[0] = {
        label: `${"Swap with Clash"}: ${userProfile.battleState[0].Allies.Clash.info.name}`,
        description: `Status Applied: ${this.statusName[0]}, Cost: ${this.mpCost} MP`,
        value: `${"Clash"}`
    }
    options[1] = {
        label: `${"Swap with Range"}: ${userProfile.battleState[0].Allies.Range.info.name}`,
        description: `Status Applied: ${this.statusName[0]}, Cost: ${this.mpCost} MP`,
        value: `${"Range"}`
    }

    const menu = new SelectMenuBuilder()
    .setPlaceholder(`~ Where do you wanna ${this.displayName} to?`)
    .setCustomId('targetOptions')
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(options)

    await interaction.editReply({
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
    var moveTar = userProfile.battleState[0].Field.curTarget;

    userProfile.battleState[0].Field.curTarget = curSlot;
    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army,
            battleState: userProfile.battleState
        });

    var desc = [`${userProfile.battleState[0][userTeam][`${curSlot}`].info.name} used ${this.displayName}!`];

    await require('./abilityCoreFunctions/Status.js').execute(interaction, client, this.fileName, desc, curSlot, userTeam, 0);
    
    userProfile.battleState[0][userTeam][`${curSlot}`].stats.mp -= this.mpCost;
    if(userProfile.battleState[0][userTeam][curSlot].stats.mp <= 0){
        userProfile.battleState[0][userTeam][curSlot].stats.mp = 0;
    }

    var temp = userProfile.battleState[0][userTeam][curSlot];
    userProfile.battleState[0][userTeam][curSlot] = userProfile.battleState[0][userTeam][moveTar];
    userProfile.battleState[0][userTeam][moveTar] = temp;

    desc[0] += `\nThen, they swapped with the ${moveTar} Lane!`;
    

    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army,
            battleState: userProfile.battleState
        });
    
    client.settingUpActionPrinting(interaction, client, desc, curSlot, userTeam);
    
}