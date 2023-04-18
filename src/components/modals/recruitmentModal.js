const { EmbedBuilder } = require('discord.js')
const UserStats = require('../../../src/schemas/userStats');

module.exports = {
    data : {
        name: 'recruitmentModal'
    },
    async execute(interaction, client){
        
        var userProfile = await UserStats.findOne({userId: interaction.user.id});
        var i = 1;
        for(; i < 6; i++){
            if(userProfile.user[0].adventureSlots[`slot${i}`].unlocked){
                if(userProfile.user[0].adventureSlots[`slot${i}`].available){
                    if(userProfile.user[0].adventureSlots[`slot${i}`].task == "recruitmenttent"){
                        break;
                    }
                }
            }
        }

        if(i == 6){
            return interaction.editReply("This Modal lead to the wrong place...");
        }

        var index = i;
        var species = userProfile.user[0].adventureSlots[`slot${i}`].unit;
        var location = userProfile.user[0].adventureSlots[`slot${i}`].location;
        var task = userProfile.user[0].adventureSlots[`slot${i}`].task;
        
        var list = interaction.fields.getTextInputValue("stats").toLowerCase().split(" ");

        //Checking for if each value given is in correct format
        for(var i = 0; i < list.length; i++){
            if(list[i] == "atk" || list[i] == "def" || 
               list[i] == "mag" || list[i] == "res" || 
               list[i] == "acc" || list[i] == "spd" || 
               list[i] == "hp" || list[i] == "mp"){}
            else{
                return interaction.editReply("One or more items is not vaild!\nTry again!");
            }
        }

        //Check if user has enough cash for recruiting
        var squad = userProfile.army[0][species].stats.atk;
            squad += userProfile.army[0][species].stats.def;
            squad += userProfile.army[0][species].stats.mag;
            squad += userProfile.army[0][species].stats.res;
            squad += userProfile.army[0][species].stats.acc;
            squad += userProfile.army[0][species].stats.spd;
            squad += userProfile.army[0][species].stats.hp/5;
            squad += userProfile.army[0][species].stats.mp/5;

        var totalCost = squad+1;
        for(var i = 1; i < list.length; i++){
            totalCost += squad+i+1;
        }

        if(totalCost > userProfile.user[0].gold){
            return interaction.editReply("You don't have enough gold to purchase ");
        }
        

        //Finally sets up the bot to execute on the following day!
        userProfile.user[0].gold -= totalCost;

        userProfile.army[0][species].stats.energy -= Math.floor(userProfile.army[0][species].stats.maxenergy * userProfile.user[0].adventureSlots[`slot${index}`]["additionalInfo"].energyMod);


        userProfile.user[0].adventureSlots[`slot${index}`] = await {
            "unlocked": true,
            "available" : false,
            "unit" : species,
            "task" : task,
            "location" : location,
            "statUps" : list
        }
    
        userProfile.army[0][species].info.activity = "busy";
    
        await UserStats.findOneAndUpdate({userId: interaction.user.id},
            {
                user: userProfile.user,
                army: userProfile.army
            });

        const adventuresEmbed = new EmbedBuilder()
            .setTitle(`Successfully sent ${userProfile.army[0][species].info.name}'s Squadrent out to go train recruits!`)
            .setDescription("Do not fret! They will back tommorow at the break of dawn!")
            .setThumbnail(interaction.user.avatarURL())
            .setColor(0x101526)
            .setTimestamp();
        await interaction.editReply({content: "Done!", embeds: [adventuresEmbed]});

    }
}