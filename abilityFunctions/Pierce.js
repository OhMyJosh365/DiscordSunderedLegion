const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js')
const UserStats = require('../src/schemas/userStats');

module.exports.displayName = "Pierce //";
module.exports.description = "//";
module.exports.mpCost = 5;
module.exports.fileName = "Pierce.js"

module.exports.attackAttackingStat = ["atk"];
module.exports.attackDefendingStat = ["def"];
module.exports.attackAbilityMods = {
    "Clash" : {"MoveMod" : 1.5, "HitMod": 85, "CritMod": 1.05},
    "Sight" : {"MoveMod" : 1.5, "HitMod": 85, "CritMod": 1.05},
    "Range" : {"MoveMod" : 1.5, "HitMod": 85, "CritMod": 1.05},
    "Far" : {"MoveMod" : 1.5, "HitMod": 85, "CritMod": 1.05},
}

module.exports.targeting = async (interaction, client) => {

    require('../abilityFunctions/abilityCoreFunctions/Attack.js').singleTargeting(interaction, client, this.fileName);

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

    userProfile = await UserStats.findOne({userId: interaction.user.id});

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
        hitRate += this.attackAbilityMods[enemyTar].HitMod;

    var probabil = 100 - hitRate;

    var dice = Math.floor(Math.random () * 100);
    dice++;

    if(dice > probabil){

        var totalDmg;
        if(userProfile.battleState[0][userTeam][curSlot].battleMods[`${this.attackAttackingStat[abilityIndex]}Mod`] < 1){
            
            totalDmg = ( userProfile.battleState[0][userTeam][curSlot].stats[this.attackAttackingStat[abilityIndex]] *
                this.attackAbilityMods[enemyTar].MoveMod);
        }

        else{
            
            totalDmg = ( userProfile.battleState[0][userTeam][curSlot].stats[this.attackAttackingStat[abilityIndex]] *
                userProfile.battleState[0][userTeam][curSlot].battleMods[`${this.attackAttackingStat[abilityIndex]}Mod`] *
                this.attackAbilityMods[enemyTar].MoveMod);
        }
        

        //Crit Rate
        var critRate = userProfile.battleState[0][userTeam][curSlot].stats.acc + userProfile.battleState[0][userTeam][curSlot].stats.spd;
            critRate /= 2;
            critRate *= this.attackAbilityMods[enemyTar].CritMod;
            critRate = Math.floor(critRate);

        probabil = 100 - critRate;

        var dice = Math.floor(Math.random () * 100);
        dice++;

        if(dice > probabil){
            desc[0] += `\nThey scored a Critical Hit!!`;
            totalDmg *= 2;
        }

        if(userProfile.battleState[0][targetTeam][enemyTar].battleMods[`${this.attackDefendingStat[abilityIndex]}Mod`] > 1){

            totalDmg -= (
                userProfile.battleState[0][targetTeam][enemyTar].stats[this.attackDefendingStat[abilityIndex]]
            );
        }
        else{
            totalDmg -= (
                userProfile.battleState[0][targetTeam][enemyTar].stats[this.attackDefendingStat[abilityIndex]] *
                userProfile.battleState[0][targetTeam][enemyTar].battleMods[`${this.attackDefendingStat[abilityIndex]}Mod`]
            );
        }
        

        totalDmg = Math.floor(totalDmg);

        if(totalDmg <= 0){
            totalDmg = 1;
        }
        
        
        userProfile.battleState[0][targetTeam][enemyTar].stats.hp -= totalDmg;
        desc[0] += `\n${userProfile.battleState[0][userTeam][`${curSlot}`].info.name} dealt ${totalDmg} `;
        desc[0] += `damage to ${userProfile.battleState[0][targetTeam][enemyTar].info.name}!`;

        if(userProfile.battleState[0][targetTeam][enemyTar].stats.hp <= 0){
            desc[0] += `\nThis knocked out ${userProfile.battleState[0][targetTeam][enemyTar].info.name}!`;
            userProfile.battleState[0][targetTeam][enemyTar].stats.hp = 0;
        }

    }
    else{
        desc[0] += `\nHowever, they missed!`;
    }
    
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