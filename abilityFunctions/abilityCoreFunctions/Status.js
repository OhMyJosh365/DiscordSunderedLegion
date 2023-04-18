const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js')
const UserStats = require('../../src/schemas/userStats.js');

module.exports.singleTargeting = async (interaction, client, fileReference) => {

    const abilityFile = require(`../${fileReference}`);
    const stautsFile = require(`../../passivesAndStatusFunctions/${abilityFile.statusName[0]}`);

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

        var hitRate = 0;
            if(abilityFile.statusTeamTar == "Enemies"){
                var totalSpd = userProfile.battleState[0].Enemies[positions[pos]].stats.spd;
                totalSpd *= userProfile.battleState[0].Enemies[positions[pos]].battleMods.spdMod;
                totalSpd = Math.floor(totalSpd);

                var totalAcc = userProfile.battleState[0].Allies[`${curSlot}`].stats.acc;
                totalAcc *= userProfile.battleState[0].Allies[`${curSlot}`].battleMods.accMod;
                totalAcc = Math.floor(totalAcc);

                hitRate = totalAcc - totalSpd;

                if(hitRate > 30){
                    hitRate = 30;
                }
                if(hitRate < -30){
                    hitRate = -30;
                }
            }
            
            hitRate += abilityFile.statusHitRate[0];


        if(userProfile.battleState[0][abilityFile.statusTeamTar][positions[pos]].stats.hp > 0){
            options[i++] = {
                label: `${positions[pos]}: ${userProfile.battleState[0][abilityFile.statusTeamTar[0]][positions[pos]].info.name}`,
                description: `Status Applied: ${abilityFile.statusName[0]}, Hit: ${hitRate}%, Cost: ${abilityFile.mpCost} MP`,
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
    var userTeam;
    var targetTeam = abilityFile.statusTeamTar;
    if(currentTurn > 4){
        targetTeam = (targetTeam === "Allies" ? "Enemies" : "Allies");
        userTeam = "Enemies"
    }
    else{
        userTeam = "Allies";
    }

    var enemyTar = userProfile.battleState[0].Field.curTarget;

    var hitRate = 0;
    if(!(userTeam == targetTeam)){
        var totalSpd = userProfile.battleState[0][targetTeam][enemyTar].stats.spd;
        totalSpd *= userProfile.battleState[0][targetTeam][enemyTar].battleMods.spdMod;
        totalSpd = Math.floor(totalSpd);

        var totalAcc = userProfile.battleState[0][userTeam][`${curSlot}`].stats.acc;
        totalAcc *= userProfile.battleState[0][userTeam][`${curSlot}`].battleMods.accMod;
        totalAcc = Math.floor(totalAcc);

        hitRate = totalAcc - totalSpd;
        if(hitRate > 30){
            hitRate = 30;
        }
        if(hitRate < -30){
            hitRate = -30;
        }
    }
    
    hitRate += abilityFile.statusHitRate[abilityIndex];

    var probabil = 100 - hitRate;

    var dice = Math.floor(Math.random () * 100);
    dice++;

    if(dice > probabil){

        desc[0] += `\n${userProfile.battleState[0][userTeam][`${curSlot}`].info.name} placed ${abilityFile.statusName[abilityIndex]} `;
        desc[0] += `onto ${userProfile.battleState[0][targetTeam][enemyTar].info.name}`;

        var conditionIndex = -1;
        for(var i = 0; i < userProfile.battleState[0][targetTeam][enemyTar].battleMods.conditions.length; i++){
            if(userProfile.battleState[0][targetTeam][enemyTar].battleMods.conditions[i]){
                conditionIndex = i;
            }
        }

        if(abilityFile.statusTime != -1){
            desc[0] += ` for ${abilityFile.statusTime[abilityIndex]} Rounds!`;
        }
        else{
            desc[0] += "!";
        }

        if(conditionIndex == -1){
            var name = abilityFile.statusName[abilityIndex];
            userProfile.battleState[0][targetTeam][enemyTar].battleMods.conditions.push({
                "Status" : abilityFile.statusName[abilityIndex], "Turns" : abilityFile.statusTime[abilityIndex]
            });
        }
        else{
            userProfile.battleState[0][targetTeam][enemyTar].battleMods.conditions[conditionIndex].Turns = abilityFile.statusTime[abilityIndex];
        }

    }
    else{
        desc[0] += `\nHowever, they missed!`;
    }
    
    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army,
            battleState: userProfile.battleState
        });
}