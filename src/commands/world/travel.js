const Canvas = require('canvas');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const mongoose = require("mongoose");
const UserStats = require('../../schemas/userStats');
const townInfo = require('../../schemas/townInfo');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('travel')
		.setDescription('Mobilize your army to a new city!')
        .addStringOption(option => option.setName("location")
            .setDescription("Select a location to complete this task!")
            .setRequired(true)
            .setAutocomplete(true)),

        async autocomplete(interaction, client){

            const focusedOption = interaction.options.getFocused(true);
            let choices;

            var userProfile  = await UserStats.findOne({userId: interaction.user.id});
            if(!userProfile) return;

            spec = ["undead", "troglodyte", "kolbold", "myconid", "mimic",
            "oblet", "wisp", "wraith", "misphet", "naga", "elf", "troll",
            "blight", "giant", "talus", "sprite", "witch", "demon", "quickling",
            "harpy", "imp", "treant", "gnoll", "goblin", "draenei",
            "dwarf", "orc", "murlok", "warg",  "dragon"];

            var maxLvl = 0;
            for(var i = 0; i < 30; i++){
                var squad = userProfile.army[0][spec[i]].stats.atk;
                squad += userProfile.army[0][spec[i]].stats.def;
                squad += userProfile.army[0][spec[i]].stats.mag;
                squad += userProfile.army[0][spec[i]].stats.res;
                squad += userProfile.army[0][spec[i]].stats.acc;
                squad += userProfile.army[0][spec[i]].stats.spd;
                squad += userProfile.army[0][spec[i]].stats.hp/5;
                squad += userProfile.army[0][spec[i]].stats.mp/5;

                if(squad > maxLvl){
                    maxLvl = squad;
                }
            }

            choices = [];
            if(maxLvl >= 300){
                choices = choices.concat([
                    "Montaulles", "Villeurmont", "Bousier", 
                    "Camles", "Perilly", "Carac", "Cappes"
                ])
            }
            if(maxLvl >= 250){
                choices = choices.concat([
                    "Bagneux", "Narleme", "Dirault", 
                    "Avivin", "Choppes", "Polvin"
                ])
            }
            if(maxLvl >= 200){
                choices = choices.concat([
                    "Cheasau", "Tamur", "Gresis", 
                    "Clervin", "Dranesse", "Routou"
                ])
            }
            if(maxLvl >= 150){
                choices = choices.concat([
                    "Houisart", "Charcourt", "Baris", 
                    "Beroux", "Vinris", "Frelly"
                ])
            }
            if(maxLvl >= 100){
                choices = choices.concat([
                    "Dinau", "Gonnois", "Ornau", 
                    "Epissy", "Levanin"
                ])
            }
            choices = choices.concat([
                "Dracon", "Vabeliard", "Bergefort", "Maivin", "Coltoise", 
                "Vazon", "Freyonne", "Saulun", "Narlet", "Purac"
            ])


            var filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
                    
            if(filtered.length > 25){
                    filtered = filtered.splice(0, 24);
            }
            
            await interaction.respond(
                    filtered.map(choice => ({ name: choice, value: choice }))
            );
        },


        
	async execute(interaction, client) {
        
        let userProfile  = await UserStats.findOne({userId: interaction.user.id});
        
        var location = interaction.options.getString("location");
        let townTo = await townInfo.findOne({name: location})

        if(!userProfile){
            await interaction.editReply(`This user does not have an account`)
        }
        else if(!townTo){
            await interaction.editReply(`Please enter a valid location!\nResponces should be towns you are able to visit`)
        }
        else if(townTo.name == userProfile.user[0].curLocation){
            await interaction.editReply(`You are already in ${location}!`)
        }
        else{
            try{
            let townFrom = await townInfo.findOne({name: userProfile.user[0].curLocation});
            spec = ["undead", "troglodyte", "kolbold", "myconid", "mimic",
            "oblet", "wisp", "wraith", "misphet", "naga", "elf", "troll",
            "blight", "giant", "talus", "sprite", "witch", "demon", "quickling",
            "harpy", "imp", "treant", "gnoll", "goblin", "draenei",
            "dwarf", "orc", "murlok", "warg",  "dragon"];

            var energyMod;
            if(townTo.region == townFrom.region) energyMod = .10;
            else energyMod = .25;

            var flag = true;
            for(var i = 0; i < 30 && flag; i++){
                if(userProfile.army[0][spec[i]].info.unlocked == true)
                    if(userProfile.army[0][spec[i]].info.activity == null)
                        if(userProfile.army[0][spec[i]].stats.energy < userProfile.army[0][spec[i]].stats.maxenergy * energyMod)
                            flag = false;
            }

            if(!flag)
                return interaction.editReply("Sorry, but some of your units do not have enough energy to travel!");

            userProfile.user[0].curLocation = location;

            for(var i = 0; i < 30 && flag; i++){
                if(userProfile.army[0][spec[i]].info.unlocked == true)
                    if(userProfile.army[0][spec[i]].info.activity == null){
                        userProfile.army[0][spec[i]].stats.energy -= Math.floor(userProfile.army[0][spec[i]].stats.maxenergy * energyMod);
                    }
            }

            var message = "You will remain here until moving again, or before dawn!";
            if(!userProfile.army[0][townTo.characterUnlock].info.unlocked){
                userProfile.army[0][townTo.characterUnlock].info.unlocked = true;
                message += `\nYou have also discovered the ${townTo.characterUnlock} Commander, ${userProfile.army[0][townTo.characterUnlock].info.name}`
            }

            await UserStats.findOneAndUpdate({userId: interaction.user.id},
                {
                    user: userProfile.user,
                    army: userProfile.army
                });
            
            const adventuresEmbed = new EmbedBuilder()
            .setTitle(`You have made the journey over to ${location}!`)
            .setDescription(message)
            .setThumbnail(interaction.user.avatarURL())
            .setColor(0x101526)
            .setTimestamp();
            await interaction.editReply({content: "Done!", embeds: [adventuresEmbed]});
            }catch(err){console.error(err)};
        }

	},
};