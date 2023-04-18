module.exports.displayName = "Poison";


module.exports.overrideHealing = async (userProfile, targetTeam, targetLane, conditionIndex, desc) => {

    var currentTurn = userProfile.battleState[0].Field.curTurn;
    var currentTurn = userProfile.battleState[0].TurnOrder[currentTurn];
    var userTeam = (currentTurn <= 4 ? "Allies" : "Enemies");

    var HealTar = userProfile.battleState[0].Field.curTarget;


    if(HealTar == targetLane && targetTeam == userTeam){

        userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions.splice(conditionIndex);

        desc[0] += `\nThe healing towards ${userProfile.battleState[0][userTeam][HealTar].info.name} was blocked by Poison!`;
        desc[0] += `\nBut, this cured Poison off of them!`;
    }
    else{
        return false;
    }
        
}


module.exports.endOfRound = async (userProfile, targetTeam, targetLane, conditionIndex, desc) => {

    userProfile.battleState[0][targetTeam][targetLane].stats.hp -= 
        Math.floor(userProfile.battleState[0][targetTeam][targetLane].stats.hp * .1);

    if(userProfile.battleState[0][targetTeam][targetLane].stats.hp < 1){
        userProfile.battleState[0][targetTeam][targetLane].stats.hp = 1;
    }

}