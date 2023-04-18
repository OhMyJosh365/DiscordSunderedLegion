module.exports.displayName = "Bleed";


module.exports.editDamage = async (userProfile, targetTeam, targetLane, conditionIndex, desc, extra) => {

    var temp = Math.floor(extra.totalDmg / 10);
    extra.totalDmg += temp;

}


module.exports.overrideHealing = async (userProfile, targetTeam, targetLane, conditionIndex, desc) => {

    var currentTurn = userProfile.battleState[0].Field.curTurn;
    var currentTurn = userProfile.battleState[0].TurnOrder[currentTurn];
    var userTeam = (currentTurn <= 4 ? "Allies" : "Enemies");

    var HealTar = userProfile.battleState[0].Field.curTarget;


    if(HealTar == targetLane && targetTeam == userTeam){

        userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions.splice(conditionIndex);

        desc[0] += `\nThe healing towards ${userProfile.battleState[0][userTeam][HealTar].info.name} was blocked by Bleed!`;
        desc[0] += `\nBut, this cured Bleed off of them!`;
    }
    else{
        return false;
    }
        
}