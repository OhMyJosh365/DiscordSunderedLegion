const mongoose = require("mongoose");
const UserStats = require('../../schemas/userStats');
const { EmbedBuilder, REST } = require("discord.js");

module.exports = (client) => {
    client.laborCalculator = async(interaction, client) => {

        var userProfile = await UserStats.findOne({userId: interaction.user.id})
        var compare = userProfile.user[0].loginDate;
        var current = new Date();
        var report = [{
            name: '~ Last Night was Productive! ~',
            value: "It's nice to have you back! Here is what you missed!",
        }];

        if(compare &&
            (current.getFullYear() > compare.getFullYear()
            || current.getMonth() > compare.getMonth()
            || current.getDay() > compare.getDay())){   

                //Execute Labor Task
                for(var i = 1; i < 6; i++){
                    if(userProfile.user[0].adventureSlots[`slot${i}`].task != null){
                        const taskCommand = await require(`../../../laborFunctions/${userProfile.user[0].adventureSlots[`slot${i}`].task}`);
                        await taskCommand.func(userProfile, interaction, client, i, report);
                        userProfile = await UserStats.findOne({userId: interaction.user.id})
                    }
                }

                units = ["undead", "troglodyte", "kolbold", "myconid", "mimic",
                        "oblet", "wisp", "wraith", "misphet", "naga", "elf", "troll",
                        "blight", "giant", "talus", "sprite", "witch", "demon", "quickling",
                        "harpy", "imp", "treant", "gnoll", "goblin", "draenei",
                        "dwarf", "orc", "murlok", "warg",  "dragon"]

                //Reset energy to squad size
                for(var i = 0; i < 30; i++){
                    var squad = userProfile.army[0][units[i]].stats.atk;
                    squad += userProfile.army[0][units[i]].stats.def;
                    squad += userProfile.army[0][units[i]].stats.mag;
                    squad += userProfile.army[0][units[i]].stats.res;
                    squad += userProfile.army[0][units[i]].stats.acc;
                    squad += userProfile.army[0][units[i]].stats.spd;
                    squad += userProfile.army[0][units[i]].stats.hp/5;
                    squad += userProfile.army[0][units[i]].stats.mp/5;

                    userProfile.army[0][units[i]].stats.energy = squad;
                    userProfile.army[0][units[i]].stats.maxenergy = squad;
                }

                //Reset Task Slots
                for(var i = 1; i < 6; i++){
                    var lock = await userProfile.user[0].adventureSlots[`slot${i}`].unlocked;
                    userProfile.user[0].adventureSlots[`slot${i}`] = await {
                        "unlocked" : lock,
                        "available" : true,
                        "unit" : null,
                        "task" : null,
                        "location" : null
                    }
                }

                //Undo all busy army members
                for(var member in userProfile.army[0]){
                    userProfile.army[0][member].info.activity = null;
                }
                

                //Send to hometown
                userProfile.user[0].curLocation = userProfile.user[0].hometown;

                //Update Login Time
                var oldDate = userProfile.user[0].loginDate;
                userProfile.user[0].loginDate = new Date();

                //Saving
                await UserStats.findOneAndUpdate({userId: interaction.user.id},
                    {
                        user: userProfile.user,
                        army: userProfile.army,
                        inventory: userProfile.inventory
                    });

                
                //Report builder
                report.push({
                    name: '~ Traveled Home! ~',
                    value: `No matter where they traveled, everyone went home to ${userProfile.user[0].hometown}!`
                })
                report.push({
                    name: '~ Energy Restored! ~',
                    value: "After a long night's rest, everyone is back to full energy!"
                })
                //Type Message
                const squadrentembed = new EmbedBuilder()
                .setTitle(`Report from Last Night!`)
                .addFields(report)
                .setColor(0x101526)
                .setTimestamp();

                await interaction.user.send({embeds: [squadrentembed]});
                await interaction.editReply("Interaction Interupted to Report on your expiditions!\nCheck your direct messages for the report!")
                





        }
    }

}