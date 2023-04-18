module.exports.displayName = "Braced";

module.exports.editDamage = async (userProfile, targetTeam, targetLane, conditionIndex, desc, extra) => {

    var currentTurn = userProfile.battleState[0].Field.curTurn;
    var currentTurn = userProfile.battleState[0].TurnOrder[currentTurn];
    var enemyTeam = (currentTurn <= 4 ? "Enemies" : "Allies");

    var MoveTar = userProfile.battleState[0].Field.curTarget;


    if(MoveTar == targetLane && targetTeam == enemyTeam){
        
        extra.totalDmg /= 2;
        extra.totalDmg = Math.floor(extra.totalDmg);
        userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions.splice(conditionIndex);

        desc[0] += `\nHowever, they were Braced, blocking half the attack!`;
    }

}


module.exports.endOfRound = async (userProfile, targetTeam, targetLane, conditionIndex, desc) => {

    userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].Turns--;

    if(userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].Turns <= 0){
        userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions.splice(conditionIndex);
    }

}