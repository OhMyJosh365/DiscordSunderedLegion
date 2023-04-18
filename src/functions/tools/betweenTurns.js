const mongoose = require("mongoose");
const UserStats = require('../../schemas/userStats');
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { SelectMenuBuilder, ActionRowBuilder, SelectMenuOptionBuilder } = require('discord.js')

module.exports = (client) => {
    client.betweenTurns = async(interaction, client) => {

        var movementFlag = false;
        var playerTurn = false;
        var turnIndex;
        
        do{
            
            var userProfile = await UserStats.findOne({userId: interaction.user.id});
            turnIndex = userProfile.battleState[0].Field.curTurn;

            if(userProfile.battleState[0].Enemies.Clash.stats.hp <= 0 &&
                userProfile.battleState[0].Enemies.Sight.stats.hp <= 0 &&
                userProfile.battleState[0].Enemies.Range.stats.hp <= 0 &&
                userProfile.battleState[0].Enemies.Far.stats.hp <= 0){
                    await UserStats.findOneAndUpdate({userId: interaction.user.id},
                        {
                            user: userProfile.user,
                            army: userProfile.army,
                            battleState: userProfile.battleState
                        });

                    return victoryScreen(interaction, client, true);     
            }
            if(userProfile.battleState[0].Allies.Clash.stats.hp <= 0 &&
                userProfile.battleState[0].Allies.Sight.stats.hp <= 0 &&
                userProfile.battleState[0].Allies.Range.stats.hp <= 0 &&
                userProfile.battleState[0].Allies.Far.stats.hp <= 0){
                    await UserStats.findOneAndUpdate({userId: interaction.user.id},
                        {
                            user: userProfile.user,
                            army: userProfile.army,
                            battleState: userProfile.battleState
                        });

                    return victoryScreen(interaction, client, false);     
            }


            if(turnIndex+1 == 8){
                
                movementFlag = true;
                 
            }
            else{
                turnIndex++;

                var currentTurn = userProfile.battleState[0].TurnOrder[turnIndex];
                var userTeam = (currentTurn <= 4 ? "Allies" : "Enemies");

                var curSlot;
                for(var ally in userProfile.battleState[0][userTeam]){
                    if(userProfile.battleState[0][userTeam][ally].battleMods.battleID == currentTurn){
                        curSlot = ally;
                        break;
                    }
                }
                
                console.log("MASSIVE ERROR! DOES BOTH ACTION AND STUN, DOESNT REMOVE STUN AND SKIP TURN");
                if(!require(`../../../passivesAndStatusFunctions/checkForStatuses`).checkForStatuses(userProfile, "beforeActing")){

                    userProfile.battleState[0].Field.curTurn = turnIndex;
                    await UserStats.findOneAndUpdate({userId: interaction.user.id},
                        {
                            user: userProfile.user,
                            army: userProfile.army,
                            battleState: userProfile.battleState
                        });
                }
                else if(userProfile.battleState[0][userTeam][curSlot].stats.hp <= 0){

                    userProfile.battleState[0].Field.curTurn = turnIndex;
                    await userProfile.battleState[0].Field["printFields"].push({
                        name: `${`~${userProfile.battleState[0][userTeam][`${curSlot}`].info.name}'s Turn`}`,
                        value: `${`${userProfile.battleState[0][userTeam][`${curSlot}`].info.name} remains knocked out!`}`
                    });
                    
                    await UserStats.findOneAndUpdate({userId: interaction.user.id},
                        {
                            user: userProfile.user,
                            army: userProfile.army,
                            battleState: userProfile.battleState
                        });
                }
                else if(userProfile.battleState[0].TurnOrder[turnIndex] >= 5){
                    
                    userProfile.battleState[0].Field.curTurn = turnIndex;
                    userProfile.battleState[0].Field.curMove = "Logging";

                    if(userProfile.battleState[0].Allies.Clash.stats.hp > 0)
                        userProfile.battleState[0].Field.curTarget = "Clash";
                    else if(userProfile.battleState[0].Allies.Sight.stats.hp > 0)
                        userProfile.battleState[0].Field.curTarget = "Sight";
                    else if(userProfile.battleState[0].Allies.Range.stats.hp > 0)
                        userProfile.battleState[0].Field.curTarget = "Range";
                    else
                        userProfile.battleState[0].Field.curTarget = "Far";
                    

                    await UserStats.findOneAndUpdate({userId: interaction.user.id},
                        {
                            user: userProfile.user,
                            army: userProfile.army,
                            battleState: userProfile.battleState
                        });

                    await require(`../../../abilityFunctions/Logging`).execut(interaction, client);
                
                }
                else{
                    playerTurn = true;
                }
            }

        }while(!playerTurn && !movementFlag);

        userProfile.battleState[0].Field.curTurn = turnIndex;
        userProfile.battleState[0].Field.curMove = "";
        userProfile.battleState[0].Field.curTarget = "";

        await UserStats.findOneAndUpdate({userId: interaction.user.id},
            {
                user: userProfile.user,
                army: userProfile.army,
                battleState: userProfile.battleState
            });

        if(movementFlag == true){
            movementPhase(interaction, client);
        }
        else{
            client.battleScreen(interaction, client);
        }
    }
}

movementPhase = async (interaction, client) => {

    var userProfile = await UserStats.findOne({userId: interaction.user.id});

    require(`../../../passivesAndStatusFunctions/checkForStatuses`).checkForStatuses(userProfile, "endOfRound");
    client.battleScreenJustPicture(interaction, client);
    

    userProfile.battleState[0].Field.curTurn = -1;

    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army,
            battleState: userProfile.battleState
        });


    if(userProfile.battleState[0].Field.printFields[0].name == "^"){
        userProfile.battleState[0].Field.printFields.shift();
    }

    const squadrentembed = new EmbedBuilder()
        .setTitle(`Movement Phase!`)
        .addFields(userProfile.battleState[0].Field.printFields)
        .setColor(0x101526)
        .setTimestamp();

    
    const menu = new SelectMenuBuilder()
        .setPlaceholder(`Would you like to rearrange your units?`)
        .setCustomId('movementOptions')
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(
            {
            label: `I would!`,
            description: `Allows you to swap unit's position, as long as they are in range.`,
            value: `StarterYes`
            },
            {
                label: `I'll Pass.`,
                description: `Skip moving units and return to Combat.`,
                value: `StarterNo`
            }
        )

    userProfile.battleState[0].Field["printFields"] = null;

    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army,
            battleState: userProfile.battleState
        });

    squadrentembed.setDescription("In-Between Turns, here's What Happened");
    await interaction.editReply({content: "Done!", embeds: [squadrentembed], components: [new ActionRowBuilder().addComponents(menu)]});

}


victoryScreen = async (interaction, client, didPlayerWin) => {

    var userProfile = await UserStats.findOne({userId: interaction.user.id});

    var positions = ["Clash", "Sight", "Range", "Far"];

    for(var i = 0; i < 4; i++){
        if(userProfile.battleState[0].Allies[positions[i]].stats.hp != userProfile.battleState[0].Allies[positions[i]].stats.maxhp){

            if(userProfile.battleState[0].Allies[positions[i]].stats.energy <= 0){
                userProfile.army[0][userProfile.user[0].activeParty[i]].stats.hp = userProfile.battleState[0].Allies[positions[i]].stats.hp;
                userProfile.army[0][userProfile.user[0].activeParty[i]].stats.energy = 0;
            }
            else{

                userProfile.army[0][userProfile.user[0].activeParty[i]].stats.hp == userProfile.army[0][userProfile.user[0].activeParty[i]].stats.maxhp;

                var percentHPMissing = userProfile.battleState[0].Allies[positions[i]].stats.hp / userProfile.battleState[0].Allies[positions[i]].stats.maxhp;
                percentHPMissing = 1 - percentHPMissing;

                userProfile.army[0][userProfile.user[0].activeParty[i]].stats.energy = Math.floor(percentHPMissing * 10);
            }

        }
        if(userProfile.battleState[0].Allies[positions[i]].stats.mp != userProfile.battleState[0].Allies[positions[i]].stats.maxmp){
            
            if(userProfile.battleState[0].Allies[positions[i]].stats.energy <= 0){
                userProfile.army[0][userProfile.user[0].activeParty[i]].stats.mp = userProfile.battleState[0].Allies[positions[i]].stats.mp;
                userProfile.army[0][userProfile.user[0].activeParty[i]].stats.energy = 0;
            }
            else{

                userProfile.army[0][userProfile.user[0].activeParty[i]].stats.mp == userProfile.army[0][userProfile.user[0].activeParty[i]].stats.maxmp;

                var percentMPMissing = userProfile.battleState[0].Allies[positions[i]].stats.mp / userProfile.battleState[0].Allies[positions[i]].stats.maxmp;
                percentMPMissing = 1 - percentMPMissing;

                userProfile.army[0][userProfile.user[0].activeParty[i]].stats.energy -= Math.floor(percentMPMissing * 10);
            }

        }
    }

    if(didPlayerWin){

        var cashEarned = 0;
        var i = 0;
        
        for(var i = 0; i < 4; i++){

            cashEarned += userProfile.battleState[0].Enemies[positions[i]].stats.atk;
            cashEarned += userProfile.battleState[0].Enemies[positions[i]].stats.def;
            cashEarned += userProfile.battleState[0].Enemies[positions[i]].stats.mag;
            cashEarned += userProfile.battleState[0].Enemies[positions[i]].stats.res;
            cashEarned += userProfile.battleState[0].Enemies[positions[i]].stats.acc;
            cashEarned += userProfile.battleState[0].Enemies[positions[i]].stats.spd;
            cashEarned += userProfile.battleState[0].Enemies[positions[i]].stats.maxhp/5;
            cashEarned += userProfile.battleState[0].Enemies[positions[i]].stats.maxmp/5;

        }
        
        userProfile.user[0].gold += cashEarned;

        const squadrentembed = new EmbedBuilder()
            .setTitle(`Victory!`)
            .setDescription(`Your army successfully defeated the enemy!\nEach Squad regained HP/MP with the Energy they had!\nYou also gained ${cashEarned} Gold from the ambush!`)
            .setColor(0x101526)
            .setTimestamp();

        await interaction.editReply({content: "Done!", embeds: [squadrentembed], files: [], components: []});
    }
    else{

        const squadrentembed = new EmbedBuilder()
            .setTitle(`Defeat...`)
            .setDescription(`Your army managed to scurry away!\nEach Squad regained HP/MP with the Energy they had!`)
            .setColor(0x101526)
            .setTimestamp();
            
        await interaction.editReply({content: "Done!", embeds: [squadrentembed], files: [], components: []});
        
    }


    userProfile.battleState[0] = {};

    return await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army,
            battleState: userProfile.battleState
        });
}