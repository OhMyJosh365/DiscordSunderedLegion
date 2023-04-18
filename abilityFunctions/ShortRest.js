const UserStats = require('../src/schemas/userStats');

module.exports.displayName = "Short Rest 🏕️";
module.exports.description = "Take a short rest to regain MP and a little HP.";
module.exports.mpCost = 0;

module.exports.execut = async (interaction, client) => {

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

    var desc = `${userProfile.battleState[0].Allies[`${curSlot}`].info.name} used ${this.displayName}!`;
    userProfile.battleState[0].Field.curTarget = curSlot;

    var twentyPer = Math.floor(userProfile.battleState[0].Allies[ally].stats.maxmp * .2);
    userProfile.battleState[0].Allies[ally].stats.mp += twentyPer;

    var fifthPer = Math.floor(userProfile.battleState[0].Allies[ally].stats.maxhp * .05);
    userProfile.battleState[0].Allies[ally].stats.hp += fifthPer;

    if(userProfile.battleState[0].Allies[ally].stats.mp >= userProfile.battleState[0].Allies[ally].stats.maxmp){
        userProfile.battleState[0].Allies[ally].stats.mp = userProfile.battleState[0].Allies[ally].stats.maxmp;
        desc += `\nResting restored thier MP to full, `
    }
    else {
        desc += `\nResting restored thier MP up by ${twentyPer} points, `
    }

    if(userProfile.battleState[0].Allies[ally].stats.hp >= userProfile.battleState[0].Allies[ally].stats.maxhp){
        userProfile.battleState[0].Allies[ally].stats.hp = userProfile.battleState[0].Allies[ally].stats.maxhp;
        desc += `and thier HP to full!`
    }
    else {
        desc += `and thier HP up by ${fifthPer} points!`
    }
    
    userProfile.battleState[0].Field["printFields"] = [{
        name: `${`~${userProfile.battleState[0].Allies[`${curSlot}`].info.name}'s Turn`}`,
        value: `${desc}`
    }]
    
    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army,
            battleState: userProfile.battleState
        });

    client.betweenTurns(interaction, client);
}