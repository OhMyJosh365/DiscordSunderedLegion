const Canvas = require('canvas');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const mongoose = require("mongoose");
const UserStats = require('../../schemas/userStats');
const townInfo = require('../../schemas/townInfo');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('townoverview')
		.setDescription('Explore all the sights in your current town!')
        .addStringOption(option => option.setName("location")
            .setDescription("Select a location to complete this task!")
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

        let userProfile = await UserStats.findOne({userId: interaction.user.id});
        
        let town;
        if(interaction.options.getString("location")){
                townProfile = await townInfo.findOne({name: interaction.options.getString("location")})
        }
        else{
                townProfile = await townInfo.findOne({name: userProfile.user[0].curLocation})
        }

        try{
            await interaction.editReply("Loading...");

            var overview = [{
                name: '~ Town Hall ~',
                value: `Sign a Lease on a Plot of Land to make ${townProfile.name} your hometown!`,
            },
            {
                name: '~ Marketplace ~',
                value: `Buy or Sell your inventory to other armies all around the contintent!`,
            },
            {
                name: '~ Recuirtment Tent ~',
                value: `Recruit new units into your army!`,
            }];

            //THERE SHOULD BE TOWN SLOTS HERE

            
            overview.push({
                name: `~ Local Resource: ${townProfile.resource} ~`,
                value: `Send your units to go ${townProfile.resource} for resources!`,
            })


            //Send Embed
            const squadrentembed = new EmbedBuilder()
                .setTitle(`The Town of ${townProfile.name}`)
                .addFields(overview)
                .setColor(0x101526)
                .setTimestamp();
            await interaction.editReply({content: "Done!", embeds: [squadrentembed]});
            }
            catch(err){
                    console.error(err);
            }

	},
};