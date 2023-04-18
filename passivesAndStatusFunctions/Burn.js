module.exports.displayName = "Burn";


module.exports.beforeUsingStats = async (userProfile, targetTeam, targetLane, conditionIndex, desc) => {

    userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].StoredStats
    
    userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].StoredStats = {
        mag: userProfile.battleState[0][targetTeam][targetLane].stats.mag,
        res: userProfile.battleState[0][targetTeam][targetLane].stats.res
    };

    userProfile.battleState[0][targetTeam][targetLane].stats.mag = 
        Math.floor(userProfile.battleState[0][targetTeam][targetLane].stats.mag / 3);

    userProfile.battleState[0][targetTeam][targetLane].stats.res = 
        Math.floor(userProfile.battleState[0][targetTeam][targetLane].stats.res / 3);

}


module.exports.afterUsingStats = async (userProfile, targetTeam, targetLane, conditionIndex, desc) => {

    userProfile.battleState[0][targetTeam][targetLane].stats.mag = 
        userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].StoredStats.mag;

    userProfile.battleState[0][targetTeam][targetLane].stats.res = 
        userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].StoredStats.res;


    userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].StoredStats = null;

}


module.exports.endOfRound = async (userProfile, targetTeam, targetLane, conditionIndex) => {

    userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].Turns--;

    if(userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].Turns <= 0){
        userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions.splice(conditionIndex);
    }

}