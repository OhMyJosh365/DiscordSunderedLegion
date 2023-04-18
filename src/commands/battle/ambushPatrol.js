const { SlashCommandBuilder } = require('discord.js');
const UserStats = require('../../schemas/userStats');
const Encounters = require('../../schemas/encounters');
const townInfo = require('../../schemas/townInfo');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ambushpatrol')
        .setDescription('Fight local guards on patrol in the area'),
    async execute(interaction, client){
        
        userProfile = await UserStats.findOne({userId: interaction.user.id});
        town = await townInfo.findOne({name: userProfile.user[0].curLocation});
        encount = await Encounters.findOne({area: town.region});

        var battleArray = {
            "Allies" : {},
            "Enemies" : {},
            "Field" : {"curTurn" : 0},
            "TurnOrder" : []
        };

        var positions = ["Clash", "Sight", "Range", "Far"]
        var i = 0;
        var id = 1;
        var speeds = [];
        var squad = 0;

        //Setting up User Team
        userProfile.user[0].activeParty.forEach(memberName => {
            battleArray.Allies[positions[i]] = {...userProfile.army[0][memberName]};
            battleArray.Allies[positions[i]]["battleMods"] = {
                "atkMod" : 1,
                "defMod" : 1,
                "magMod" : 1,
                "resMod" : 1,
                "accMod" : 1,
                "spdMod" : 1,
                "conditions" : [],
                "battleID" : id++
            }
            

            squad += battleArray.Allies[positions[i]].stats.atk;
            squad += battleArray.Allies[positions[i]].stats.def;
            squad += battleArray.Allies[positions[i]].stats.mag;
            squad += battleArray.Allies[positions[i]].stats.res;
            squad += battleArray.Allies[positions[i]].stats.acc;
            squad += battleArray.Allies[positions[i]].stats.spd;
            squad += battleArray.Allies[positions[i]].stats.maxhp/5;
            squad += battleArray.Allies[positions[i]].stats.maxmp/5;

            speeds.push(battleArray.Allies[positions[i++]].stats.spd);
        });
        

        //Setting up Enemy Team
        var encounterOptions = encount.enemies;
        var rolls = [];
        for(var i = 0; i < 4; i++){
            var dice = Math.floor(Math.random () * encounterOptions.length);
            if(rolls.indexOf(dice) == -1){
                rolls[i] = dice;
            }
            else{
                i--;
            }
        }
        encounterOptions = [
            encounterOptions[rolls[0]],
            encounterOptions[rolls[1]],
            encounterOptions[rolls[2]],
            encounterOptions[rolls[3]],
        ];

        //Stats are next!
        squad /= 4;
        squad -= 8;

        var i = 0;
        encounterOptions.forEach(memberName => {
            battleArray.Enemies[positions[i]] = {...memberName};
            battleArray.Enemies[positions[i]].stats = {
                "hp" : 5 * Math.floor(1 + squad * memberName.stats.hp),
                "maxhp" : 5 * Math.floor(1 + squad * memberName.stats.hp),
                "mp" : 5 * Math.floor(1 + squad * memberName.stats.mp),
                "maxmp" : 5 * Math.floor(1 + squad * memberName.stats.mp),
                "atk" : Math.floor(1 + squad * memberName.stats.atk),
                "def" : Math.floor(1 + squad * memberName.stats.def),
                "mag" : Math.floor(1 + squad * memberName.stats.mag),
                "res" : Math.floor(1 + squad * memberName.stats.res),
                "acc" : Math.floor(1 + squad * memberName.stats.acc),
                "spd" : Math.floor(1 + squad * memberName.stats.spd),
            }
            battleArray.Enemies[positions[i]]["battleMods"] = {
                "atkMod" : 1,
                "defMod" : 1,
                "magMod" : 1,
                "resMod" : 1,
                "accMod" : 1,
                "spdMod" : 1,
                "conditions" : [],
                "battleID" : id++
            }
            speeds.push(battleArray.Enemies[positions[i++]].stats.spd);
        })

        //Setting Up Turn Order
        var pos = 0;
        var turns = speeds.sort().reverse();
        var teams = ["Allies", "Enemies"];
        var slots = ["Clash", "Sight", "Range", "Far"]
        var loopFlag = true;
        var order = [];
        
        for(var t = 0; t < 2; t++){
            for(var s = 0; s < 4; s++){
                loopFlag = true;
                for(var i = 0; i < 8 && loopFlag; i++){
                    
                    if(battleArray[teams[t]][slots[s]].stats.spd == turns[i]){
                        order[i] = battleArray[teams[t]][slots[s]].battleMods.battleID;
                        turns[i] = -1;
                        loopFlag = false;
                    }
                }
            }
        }
        battleArray.TurnOrder = order;

        if(battleArray.TurnOrder[battleArray.Field.curTurn] >= 5){

            battleArray["Field"]["printFields"] = [{
                name: `^`,
                value: `^`
            }];
            battleArray.Field.curTurn--;

            await UserStats.findOneAndUpdate({userId: interaction.user.id},
                {
                    user: userProfile.user,
                    army: userProfile.army,
                    battleState: battleArray
                });
            
            client.betweenTurns(interaction, client);

        }
        else{

            await UserStats.findOneAndUpdate({userId: interaction.user.id},
                {
                    user: userProfile.user,
                    army: userProfile.army,
                    battleState: battleArray
                });
            
            client.battleScreen(interaction, client)
        }
    } 
}