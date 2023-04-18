const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js');
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

        if(userProfile.battleState[0].Enemies[positions[pos]].stats.hp <= 0){
            continue;
        }
        

        //Calculating Total Damage
        var totalDmg;
            totalDmg = ( userProfile.battleState[0].Allies[curSlot].stats[abilityFile.attackAttackingStat[0]] *
                    userProfile.battleState[0].Allies[curSlot].battleMods[`${abilityFile.attackAttackingStat[0]}Mod`] *
                    abilityFile.attackAbilityMods[positions[pos]].MoveMod);

            totalDmg -= (
                userProfile.battleState[0].Enemies[positions[[pos]]].stats[abilityFile.attackDefendingStat[0]] *
                userProfile.battleState[0].Enemies[positions[[pos]]].battleMods[`${abilityFile.attackDefendingStat[0]}Mod`]
            );

            totalDmg = Math.floor(totalDmg);

            if(totalDmg <= 0){
                totalDmg = 1;
            }


        //Calculating Hit Rates
        var hitRate;
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
            hitRate += abilityFile.attackAbilityMods[positions[pos]].HitMod;


        //Calulating Crit Rates
        var critRate = userProfile.battleState[0].Allies[curSlot].stats.acc + userProfile.battleState[0].Allies[curSlot].stats.spd;
            critRate /= 2;
            critRate *= abilityFile.attackAbilityMods[positions[pos]].CritMod;
            critRate = Math.floor(critRate);

            if(critRate < 0){
                critRate = 0;
            }


        //Adding Selection to List of Options
        options[i++] = {
            label: `${positions[pos]}: ${userProfile.battleState[0].Enemies[positions[pos]].info.name}`,
            description: `Damage: ${totalDmg}, Hit: ${hitRate}%, Crit: ${critRate}%, Cost: ${abilityFile.mpCost} MP`,
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
    var returnVal;

    var currentTurn = userProfile.battleState[0].Field.curTurn;
    var currentTurn = userProfile.battleState[0].TurnOrder[currentTurn];
    var targetTeam = (userTeam === "Allies" ? "Enemies" : "Allies");

    var enemyTar = userProfile.battleState[0].Field.curTarget;

    require(`../../passivesAndStatusFunctions/checkForStatuses`).checkForStatuses(userProfile, "beforeUsingStats");

    var hitRate;
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
        hitRate += abilityFile.attackAbilityMods[enemyTar].HitMod;

    var probabil = 100 - hitRate;

    var dice = Math.floor(Math.random () * 100);
    dice++;

    if(dice > probabil){

        var totalDmg;
        totalDmg = ( userProfile.battleState[0][userTeam][curSlot].stats[abilityFile.attackAttackingStat[abilityIndex]] *
            userProfile.battleState[0][userTeam][curSlot].battleMods[`${abilityFile.attackAttackingStat[abilityIndex]}Mod`] *
            abilityFile.attackAbilityMods[enemyTar].MoveMod);

        //Crit Rate
        var critRate = userProfile.battleState[0][userTeam][curSlot].stats.acc + userProfile.battleState[0][userTeam][curSlot].stats.spd;
            critRate /= 2;
            critRate *= abilityFile.attackAbilityMods[enemyTar].CritMod;
            critRate = Math.floor(critRate);

        probabil = 100 - critRate;

        var dice = Math.floor(Math.random () * 100);
        dice++;

        if(dice > probabil){
            desc[0] += `\nThey scored a Critical Hit!!`;
            totalDmg *= 2;
        }

        totalDmg -= (
            userProfile.battleState[0][targetTeam][enemyTar].stats[abilityFile.attackDefendingStat[abilityIndex]] *
            userProfile.battleState[0][targetTeam][enemyTar].battleMods[`${abilityFile.attackDefendingStat[abilityIndex]}Mod`]
        );

        totalDmg = Math.floor(totalDmg);

        if(totalDmg <= 0){
            totalDmg = 1;
        }

        extraInfoForStatus = {"totalDmg": totalDmg, "dmgType": abilityFile.attackAttackingStat[abilityIndex]};
        if(require(`../../passivesAndStatusFunctions/checkForStatuses`).checkForStatuses(userProfile, "editDamage", desc, extraInfoForStatus)){
            totalDmg = extraInfoForStatus["totalDmg"];
        }
        
        userProfile.battleState[0][targetTeam][enemyTar].stats.hp -= totalDmg;
        desc[0] += `\n${userProfile.battleState[0][userTeam][`${curSlot}`].info.name} dealt ${totalDmg} `;
        desc[0] += `damage to ${userProfile.battleState[0][targetTeam][enemyTar].info.name}!`;

        if(userProfile.battleState[0][targetTeam][enemyTar].stats.hp <= 0){
            desc[0] += `\nThis knocked out ${userProfile.battleState[0][targetTeam][enemyTar].info.name}!`;
            userProfile.battleState[0][targetTeam][enemyTar].stats.hp = 0;
        }
        returnVal = true;
    }
    else{
        desc[0] += `\nHowever, they missed!`;
        returnVal = false;
    }
    require(`../../passivesAndStatusFunctions/checkForStatuses`).checkForStatuses(userProfile, "afterUsingStats");

    
    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army,
            battleState: userProfile.battleState
        });
    return returnVal;
}