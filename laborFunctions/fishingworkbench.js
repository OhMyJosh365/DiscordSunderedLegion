const mongoose = require("mongoose");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { SelectMenuBuilder, ActionRowBuilder, SelectMenuOptionBuilder } = require('discord.js')
const UserStats = require('../src/schemas/userStats');
const Craftings = require('../src/schemas/crafting');


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


    userProfile.user[0].adventureSlots[`slot${slotNum}`] = await {
        "unlocked": true,
        "available" : true,
        "unit" : species,
        "task" : task,
        "location" : location,
        "additionalInfo" : {"energyMod" : energyMod}
    }

    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army
        });


    var craftings = await Craftings.findOne();
    var options = [];
    var i = 0;

    for(let item in craftings.fishingRecipes[0]){
        
        var flag = true;

        for(let part in craftings.fishingRecipes[0][`${item}`].ingredients){

            if(craftings.fishingRecipes[0][`${item}`].ingredients[`${part}`] > userProfile.inventory[0][`${part}`]
                || userProfile.inventory[0][`${part}`] == undefined
                || craftings.fishingRecipes[0][`${item}`].lvlMin > userProfile.army[0][`${species}`].profession.fishing.lvl){

                flag = false;
            }
        }

        if(flag){

            var recip = "";
            var j = 1;
            for(let part in craftings.fishingRecipes[0][`${item}`].ingredients){

                recip += ` ${part} : ${craftings.fishingRecipes[0][`${item}`].ingredients[`${part}`]}`
                if(j++ != craftings.fishingRecipes[0][`${item}`].ingredients.length){
                    recip += ","
                }
                //FIGURE OUT COMMAS LATER!!!
            }

            options[i++] = {
                label: `${item}`,
                description: `Type: ${craftings.fishingRecipes[0][`${item}`].type}; Recipe: [${recip}]`,
                value: `${item}`
            }
        }

    }
    

    if(options.length == 0){
        return await interaction.editReply({
            content : "Sorry, you have no ingredents to craft here!"
        })
    }
    const menu = new SelectMenuBuilder()
        .setCustomId('crafting-menu')
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(options)
    
    await interaction.editReply({
        components: [new ActionRowBuilder().addComponents(menu)]
    })
    
}


module.exports = {func, requirements}