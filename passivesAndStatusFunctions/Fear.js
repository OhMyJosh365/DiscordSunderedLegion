module.exports.displayName = "Fear";


module.exports.overrideHealing = async (userProfile, targetTeam, targetLane, conditionIndex, desc) => {

    var currentTurn = userProfile.battleState[0].Field.curTurn;
    var currentTurn = userProfile.battleState[0].TurnOrder[currentTurn];
    var userTeam = (currentTurn <= 4 ? "Allies" : "Enemies");

    var HealTar = userProfile.battleState[0].Field.curTarget;


    if(HealTar == targetLane && targetTeam == userTeam){

        userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions.splice(conditionIndex);

    }
        
}


module.exports.endOfRound = async (userProfile, targetTeam, targetLane, conditionIndex) => {

    userProfile.battleState[0][targetTeam][targetLane].stats.mp -= 
        Math.floor(userProfile.battleState[0][targetTeam][targetLane].stats.mp * .1);

    if(userProfile.battleState[0][targetTeam][targetLane].stats.mp < 0){
        userProfile.battleState[0][targetTeam][targetLane].stats.mp = 0;
    }

    userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].Turns--;

    if(userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].Turns <= 0){
        userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions.splice(conditionIndex);
    }

}