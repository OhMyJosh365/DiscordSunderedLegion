module.exports.displayName = "Shock";


module.exports.beforeUsingStats = async (userProfile, targetTeam, targetLane, conditionIndex, desc) => {

    userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].StoredStats
    
    userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].StoredStats = {
        spd: userProfile.battleState[0][targetTeam][targetLane].stats.spd,
        acc: userProfile.battleState[0][targetTeam][targetLane].stats.acc
    };

    userProfile.battleState[0][targetTeam][targetLane].stats.spd = 
        Math.floor(userProfile.battleState[0][targetTeam][targetLane].stats.spd / 3);

    userProfile.battleState[0][targetTeam][targetLane].stats.acc = 
        Math.floor(userProfile.battleState[0][targetTeam][targetLane].stats.acc / 3);

}


module.exports.afterUsingStats = async (userProfile, targetTeam, targetLane, conditionIndex, desc) => {

    userProfile.battleState[0][targetTeam][targetLane].stats.spd = 
        userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].StoredStats.spd;

    userProfile.battleState[0][targetTeam][targetLane].stats.acc = 
        userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].StoredStats.acc;


    userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].StoredStats = null;

}


module.exports.endOfRound = async (userProfile, targetTeam, targetLane, conditionIndex, desc) => {

    userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].Turns--;

    if(userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].Turns <= 0){
        userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions.splice(conditionIndex);
    }

}