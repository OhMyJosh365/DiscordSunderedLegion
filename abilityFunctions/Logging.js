const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js')
const UserStats = require('../src/schemas/userStats');

module.exports.displayName = "Chop 🪓";
module.exports.description = "Using Level in Logging, Attack an enemy.";
module.exports.mpCost = 1;

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
    
    var professionLvl = Math.floor(userProfile.battleState[0].Allies[`${curSlot}`].profession.logging.lvl);

    var i = 0;
    var options = [];
    var positions = ["Clash", "Sight", "Range", "Far"];

    for(var pos in positions){
        var totalSpd = userProfile.battleState[0].Enemies[positions[pos]].stats.spd;
        totalSpd *= userProfile.battleState[0].Enemies[positions[pos]].battleMods.spdMod;
        totalSpd = Math.floor(totalSpd);

        var totalAcc = userProfile.battleState[0].Allies[`${curSlot}`].stats.acc;
        totalAcc *= userProfile.battleState[0].Allies[`${curSlot}`].battleMods.accMod;
        totalAcc = Math.floor(totalAcc);

        difAccSpd = totalAcc - totalSpd;
        if(difAccSpd > 30){
            difAccSpd = 30;
        }
        if(difAccSpd < -30){
            difAccSpd = -30;
        }

        if(userProfile.battleState[0].Enemies[positions[pos]].stats.hp > 0){
            options[i++] = {
                label: `${positions[pos]}: ${userProfile.battleState[0].Enemies[positions[pos]].info.name}`,
                description: `Damage: ${professionLvl}, Accuracy: ${90+difAccSpd}%, Cost: ${this.mpCost} MP`,
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

    await interaction.editReply({
        components: [new ActionRowBuilder().addComponents(menu)]
    })
}


module.exports.execut = async (interaction, client) => {

    userProfile = await UserStats.findOne({userId: interaction.user.id});

    var currentTurn = userProfile.battleState[0].Field.curTurn;
    var currentTurn = userProfile.battleState[0].TurnOrder[currentTurn];
    var userTeam, targetTeam;
    if(currentTurn <= 4){
        userTeam = "Allies";
        targetTeam = "Enemies";
    }
    else{
        userTeam = "Enemies";
        targetTeam = "Allies";
    }
    
    var curSlot;
    for(var ally in userProfile.battleState[0][userTeam]){
        if(userProfile.battleState[0][userTeam][ally].battleMods.battleID == currentTurn){
            curSlot = ally;
            break;
        }
    }

    var desc = `${userProfile.battleState[0][userTeam][`${curSlot}`].info.name} used ${this.displayName}!`;
    var enemyTar = userProfile.battleState[0].Field.curTarget;
    userProfile.battleState[0][userTeam][ally].stats.mp -= 1;

    if(userProfile.battleState[0][userTeam][ally].stats.mp <= 0){
        userProfile.battleState[0][userTeam][ally].stats.mp = 0;
    }

    var totalSpd = userProfile.battleState[0][targetTeam][enemyTar].stats.spd;
        totalSpd *= userProfile.battleState[0][targetTeam][enemyTar].battleMods.spdMod;
        totalSpd = Math.floor(totalSpd);

        var totalAcc = userProfile.battleState[0][userTeam][`${curSlot}`].stats.acc;
        totalAcc *= userProfile.battleState[0][userTeam][`${curSlot}`].battleMods.accMod;
        totalAcc = Math.floor(totalAcc);

        difAccSpd = totalAcc - totalSpd;
        if(difAccSpd > 30){
            difAccSpd = 30;
        }
        if(difAccSpd < -30){
            difAccSpd = -30;
        }

    var probabil = 100 - (difAccSpd + 90);

    var dice = Math.floor(Math.random () * 100);
    dice++;

    if(dice > probabil){
        var professionLvl = Math.floor(userProfile.battleState[0][userTeam][`${curSlot}`].profession.logging.lvl);

        userProfile.battleState[0][targetTeam][enemyTar].stats.hp -= professionLvl;
        desc += `\n${userProfile.battleState[0][userTeam][`${curSlot}`].info.name} dealt ${professionLvl} `;
        desc += `damage to ${userProfile.battleState[0][targetTeam][enemyTar].info.name}!`;

        if(userProfile.battleState[0][targetTeam][enemyTar].stats.hp <= 0){
            desc += `\nThis knocked out ${userProfile.battleState[0][targetTeam][enemyTar].info.name}!`;
            userProfile.battleState[0][targetTeam][enemyTar].stats.hp = 0;
        }
    }

    else{
        desc += `\nHowever, they missed!`
    }

    var between = false;
    if(!userProfile.battleState[0].Field["printFields"]){
        userProfile.battleState[0].Field["printFields"] = [{
            name: `${`~${userProfile.battleState[0][userTeam][`${curSlot}`].info.name}'s Turn`}`,
            value: `${desc}`
        }]
    }
    else{
        userProfile.battleState[0].Field["printFields"].push({
            name: `${`~${userProfile.battleState[0][userTeam][`${curSlot}`].info.name}'s Turn`}`,
            value: `${desc}`
        })
        between = true;
    }
    
    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army,
            battleState: userProfile.battleState
        });

    if(!between){
        client.betweenTurns(interaction, client);
    }
    
}