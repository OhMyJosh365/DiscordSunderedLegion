module.exports.displayName = "Stunned";


module.exports.beforeActing = async (userProfile, targetTeam, targetLane, conditionIndex, desc) => {

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

    if(curSlot == targetLane && targetTeam == userTeam){
        await userProfile.battleState[0].Field["printFields"].push({
            name: `${`~${userProfile.battleState[0][userTeam][`${curSlot}`].info.name}'s Turn`}`,
            value: `${`${userProfile.battleState[0][userTeam][`${curSlot}`].info.name} is Stunned and cannot act!`}`
        });

        return true;
    }

}