const mongoose = require("mongoose");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const UserStats = require('../src/schemas/userStats');


func = async (userProfile, interaction, client, slotNum, report) => {

    unit = userProfile.user[0].adventureSlots[`slot${slotNum}`].unit;
    description = `${userProfile.army[0][unit].info.name}'s Squadrent went fishing in ${userProfile.user[0].adventureSlots[`slot${slotNum}`].location}!`
    
    //Get Skins
    var gatheredMaterial = Math.floor(userProfile.army[0][unit].profession.fishing.lvl);
    gatheredMaterial *= userProfile.army[0][unit].stats.energy / userProfile.army[0][unit].stats.maxenergy
    gatheredMaterial = Math.floor(gatheredMaterial);

    if(gatheredMaterial <= 0){
        gatheredMaterial = 1;
    }

    if(userProfile.inventory[0]["Carp"] != undefined){
        userProfile.inventory[0]["Carp"] += gatheredMaterial;
    }
    else{
        userProfile.inventory[0]["Carp"] = gatheredMaterial;
    }
    description += `\nThey were able to gather ${gatheredMaterial} Carp for your army!`

    //Gain XP
    var oldLvl = await userProfile.army[0][unit].profession.fishing.lvl;
    userProfile.army[0][unit].profession.fishing.lvl += userProfile.army[0][unit].profession.fishing.growth;

    if(Math.floor(userProfile.army[0][unit].profession.fishing.lvl - oldLvl) >= 1){
        description += `\nAlso, ${userProfile.army[0][unit].info.name} gained ${Math.floor(userProfile.army[0][unit].profession.fishing.lvl - oldLvl)} lvl in Fishing!`
    }

    //Save Stats
    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            army : userProfile.army,
            inventory : userProfile.inventory
        });

    report.push({
        name: '~ Fishing Complete! ~',
        value: description
    })

}

requirements = async (userProfile, interaction, client, energyMod, species, task, location, slotNum) => {

    //Energy Subtract
    userProfile.army[0][species].stats.energy -= Math.floor(userProfile.army[0][species].stats.maxenergy * energyMod);


    userProfile.user[0].adventureSlots[`slot${slotNum}`] = await {
        "unlocked": true,
        "available" : false,
        "unit" : species,
        "task" : task,
        "location" : location
    }

    userProfile.army[0][species].info.activity = "busy";

    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army
        });

    
    const adventuresEmbed = new EmbedBuilder()
        .setTitle(`Successfully sent ${userProfile.army[0][species].info.name}'s Squadrent out to go fishing!`)
        .setDescription("Do not fret! They will back tommorow at the break of dawn!")
        .setThumbnail(interaction.user.avatarURL())
        .setColor(0x101526)
        .setTimestamp();
    await interaction.editReply({content: "Done!", embeds: [adventuresEmbed]});
    
}


module.exports = {func, requirements}