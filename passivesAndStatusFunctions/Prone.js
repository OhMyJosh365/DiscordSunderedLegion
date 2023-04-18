module.exports.displayName = "Prone";


module.exports.beforeUsingStats = async (userProfile, targetTeam, targetLane, conditionIndex, desc) => {

    userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].StoredStats
    
    userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].StoredStats = {
        atk: userProfile.battleState[0][targetTeam][targetLane].stats.atk,
        def: userProfile.battleState[0][targetTeam][targetLane].stats.def
    };

    userProfile.battleState[0][targetTeam][targetLane].stats.atk = 
        Math.floor(userProfile.battleState[0][targetTeam][targetLane].stats.atk / 3);

    userProfile.battleState[0][targetTeam][targetLane].stats.def = 
        Math.floor(userProfile.battleState[0][targetTeam][targetLane].stats.def / 3);

}


module.exports.afterUsingStats = async (userProfile, targetTeam, targetLane, conditionIndex, desc) => {

    userProfile.battleState[0][targetTeam][targetLane].stats.atk = 
        userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].StoredStats.atk;

    userProfile.battleState[0][targetTeam][targetLane].stats.def = 
        userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].StoredStats.def;


    userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].StoredStats = null;

}


module.exports.endOfRound = async (userProfile, targetTeam, targetLane, conditionIndex, desc) => {

    userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].Turns--;

    if(userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions[conditionIndex].Turns <= 0){
        userProfile.battleState[0][targetTeam][targetLane].battleMods.conditions.splice(conditionIndex);
    }

}