const mongoose = require("mongoose");
const UserStats = require('../src/schemas/userStats');
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");

func = async (client, player, slotNum) => {

    var userProfile = await UserStats.findOne({userId: player.userId});

    unit = userProfile.user[0].adventureSlots[`slot${slotNum}`].unit;
    description = `${userProfile.army[0][unit].info.name}'s Squadrent chopped down trees in ${userProfile.user[0].adventureSlots[`slot${slotNum}`].location}!`
    
    //Get Wood
    var gatheredMaterial = Math.floor(userProfile.army[0][unit].profession.logging.lvl);
    gatheredMaterial *= userProfile.army[0][unit].stats.energy / userProfile.army[0][unit].stats.maxenergy
    gatheredMaterial = Math.floor(gatheredMaterial);

    if(gatheredMaterial <= 0){
        gatheredMaterial = 1;
    }

    if(userProfile.inventory[0]["Wood"] != undefined){
        userProfile.inventory[0]["Wood"] += gatheredMaterial;
    }
    else{
        userProfile.inventory[0]["Wood"] = gatheredMaterial;
    }
    description += `\nThey were able to gather ${gatheredMaterial} Wood for your army!`

    //Gain XP
    var oldLvl = await userProfile.army[0][unit].profession.logging.lvl;
    userProfile.army[0][unit].profession.logging.lvl += userProfile.army[0][unit].profession.logging.growth;

    if(Math.floor(userProfile.army[0][unit].profession.logging.lvl - oldLvl) >= 1){
        description += `\nAlso, ${userProfile.army[0][unit].info.name} gained ${Math.floor(userProfile.army[0][unit].profession.logging.lvl - oldLvl)} lvl in Logging!`
    }

    //Un busy the unit
    userProfile.army[0][unit].info.activity = null;

    //Removing Task from List
    userProfile.user[0].adventureSlots[`slot${slotNum}`] = await {
        "unlocked" : userProfile.user[0].adventureSlots[`slot${slotNum}`].unlocked,
        "available" : true,
        "unit" : null,
        "task" : null,
        "location" : null,
        "endTime" : null,
        "duration" : null
    }

    //Save Stats
    await UserStats.findOneAndUpdate({userId: userProfile.userId},
        {
            user: userProfile.user,
            army : userProfile.army,
            inventory : userProfile.inventory
        });
    
    const squadrentembed = new EmbedBuilder()
        .setTitle(`Report from ${userProfile.army[0][unit].info.name}!`)
        .addFields({
            name: '~ Logging Complete! ~',
            value: description
        })
        .setColor(0x101526)
        .setTimestamp();

    client.users.fetch(userProfile.userId, false).then((user) => {
        user.send({embeds: [squadrentembed]});
    });

}

requirements = async (userProfile, interaction, client, energyMod, species, task, location, minute, slotNum) => {


    //Energy Subtract
    userProfile.army[0][species].stats.energy -= minute + Math.floor(userProfile.army[0][species].stats.maxenergy * energyMod);

    userProfile.user[0].adventureSlots[`slot${slotNum}`] = await {
        "unlocked": true,
        "available" : false,
        "unit" : species,
        "task" : task,
        "location" : location,
        "endTime" : (60000 * minute) + new Date().getTime(),
        "duration" : minute
    }

    userProfile.army[0][species].info.activity = "busy";

    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army
        });

    
    const adventuresEmbed = new EmbedBuilder()
        .setTitle(`Successfully sent ${userProfile.army[0][species].info.name}'s Squadrent out to chop Wood!`)
        .setDescription(`Do not fret! They will back in ${minute} minutes!`)
        .setThumbnail(interaction.user.avatarURL())
        .setColor(0x101526)
        .setTimestamp();
    await interaction.editReply({content: "Done!", embeds: [adventuresEmbed]});
    
}


module.exports = {func, requirements}