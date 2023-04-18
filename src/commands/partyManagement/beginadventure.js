const Canvas = require('canvas');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const mongoose = require("mongoose");
const UserStats = require('../../schemas/userStats');
const townInfo = require('../../schemas/townInfo');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('beginadventure')
		.setDescription('Send a squadrent out to gather resources!')
        .addStringOption(option => option.setName("species")
            .setDescription("Enter the speices that you are sending out")
            .setRequired(true)
            .setAutocomplete(true))
        .addStringOption(option => option.setName("location")
            .setDescription("Select a location to complete this task!")
            .setRequired(true)
            .setAutocomplete(true))
        .addStringOption(option => option.setName("task")
            .setDescription("Send unit to complete a task at that town!\nSelect this after location!")
            .setRequired(true)
            .setAutocomplete(true))
        .addIntegerOption(option => option.setName("minutes")
            .setDescription("How long you want to send out a unit! Every 20 mins grants 1/3 yield.")
            .setRequired(true)
            .setAutocomplete(true)),

        async autocomplete(interaction, client){

            const focusedOption = interaction.options.getFocused(true);
            let choices;

            if (focusedOption.name === 'species') {
                            var userProfile  = await UserStats.findOne({userId: interaction.user.id});
                            if(!userProfile) return;

                            options = ["undead", "troglodyte", "kolbold", "myconid", "mimic",
                            "oblet", "wisp", "wraith", "misphet", "naga", "elf", "troll",
                            "blight", "giant", "talus", "sprite", "witch", "demon", "quickling",
                            "harpy", "imp", "treant", "gnoll", "goblin", "draenei",
                            "dwarf", "orc", "murlok", "warg",  "dragon"]

                            choices = [];
                            for(var i = 0; i < 30; i++){
                                    if(userProfile.army[0][options[i]].info.unlocked 
                                        && userProfile.army[0][options[i]].info.activity == null){
                                            choices = choices.concat(options[i])
                                    }
                            }
                
                }

                if(focusedOption.name === 'location'){

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

                }

                if(focusedOption.name === 'task'){
                    var town = await townInfo.findOne({name: interaction.options.getString("location")});
                    if(!town) return;

                    choices = ["recruitmenttent", town.resource.toLowerCase()];
                }

                if(focusedOption.name === 'minutes'){
                    choices = [];
                    for(var i = 1; i < 25; i++){
                        choices.push(i*15);
                    }

                    return await interaction.respond(
                        choices.map(choice => ({ name: choice, value: choice }))
                );
                }

                var filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
                       
                if(filtered.length > 25){
                        filtered = filtered.splice(0, 24);
                }
                
                await interaction.respond(
                        filtered.map(choice => ({ name: choice, value: choice }))
                );
        },


        
	async execute(interaction, client) {
        
        let userProfile  = await UserStats.findOne({userId: interaction.user.id})
        if(!userProfile){
            return await interaction.editReply(`This user does not have an account`)
        }

        var species = interaction.options.getString("species");
        var task = interaction.options.getString("task");
        var location = interaction.options.getString("location");
        var minute = interaction.options.getInteger("minutes");
        let townTo = await townInfo.findOne({name: location});

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

        let townFrom = await townInfo.findOne({name: userProfile.user[0].curLocation});

        var energyMod;
        if(townTo.name == townFrom.name) energyMod = 0
        if(townTo.region == townFrom.region) energyMod = .10;
        else energyMod = .25;

        //Apply Task into slots
        var i = 1;
        for(; i < 6; i++){
            if(userProfile.user[0].adventureSlots[`slot${i}`].available 
            && userProfile.user[0].adventureSlots[`slot${i}`].unlocked){
                break;
            }
        }

        if(i > 5){
            interaction.editReply("You have no more available, unlocked adventure slots!\nCome back tommorow to gather what they collected!");
        }
        else if(!userProfile.army[0][species]){
            await interaction.editReply(`Please enter a valid species!\nResponces should be lower case and the species, not the name`)
        }
        else if(userProfile.army[0][species].info.activity != null){
            await interaction.editReply(`This squadrent is already busy!\nPlease enter a unit that is not already on an adventure`)
        }
        else if(!await require(`../../../laborFunctions/${task}`)){
            await interaction.editReply(`Please enter a valid task!\nYou may check tasks in the Trades tab of squadrent info.`)
        }
        else if(townTo.lvlMin > maxLvl){
            await interaction.editReply(`This area is to high level for your army!\nTry a recommended area in the suggestions.`)
        }
        else if(userProfile.army[0][species].stats.energy < minute + Math.floor(userProfile.army[0][species].stats.maxenergy * energyMod)){
            await interaction.editReply(`Your unit does not have enough energy to travel here or for that long!`)
        }
        else if(minute % 15 != 0){
            await interaction.editReply(`Time spent must be in increments of 15 minutes!`)
        }
        else{
            try{

                //Action Specific Requirement check
                const taskCommand = await require(`../../../laborFunctions/${task}`);
                return taskCommand.requirements(userProfile, interaction, client, energyMod, species, task, location, minute, i);

            } catch(err){
                console.error(err);
            }
        }
	},
};