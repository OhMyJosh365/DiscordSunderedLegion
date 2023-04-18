const Canvas = require('canvas');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const mongoose = require("mongoose");
const UserStats = require('../../schemas/userStats');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('swapparty')
		.setDescription('Set your Active Party Members!')
                .addStringOption(option => option.setName("clash")
                    .setDescription("Select the species that starts in Clash")
                    .setRequired(true)
                    .setAutocomplete(true))

                .addStringOption(option => option.setName("sight")
                    .setDescription("Select the species that starts in Sight")
                        .setRequired(true)
                        .setAutocomplete(true))
                        
                .addStringOption(option => option.setName("range")
                        .setDescription("Select the species that starts in Range")
                        .setRequired(true)
                        .setAutocomplete(true))
                        
                .addStringOption(option => option.setName("far")
                        .setDescription("Select the species that starts in Far")
                        .setRequired(true)
                        .setAutocomplete(true)),


    async autocomplete(interaction, client){

        const focusedOption = interaction.options.getFocused(true);
        let choices;

        var userProfile  = await UserStats.findOne({userId: interaction.user.id});
        if(!userProfile) return;

        options = ["undead", "troglodyte", "kolbold", "myconid", "mimic",
        "oblet", "wisp", "wraith", "misphet", "naga", "elf", "troll",
        "blight", "giant", "talus", "sprite", "witch", "demon", "quickling",
        "harpy", "imp", "treant", "gnoll", "goblin", "draenei",
        "dwarf", "orc", "murlok", "warg",  "dragon"]

        choices = [];
        for(var i = 0; i < 30; i++){
                if(userProfile.army[0][options[i]].info.unlocked){
                        choices = choices.concat(options[i])
                }
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

        //This needs a lot of checks but it works!

        var userProfile  = await UserStats.findOne({userId: interaction.user.id})

        var clash = interaction.options.getString("clash");
        var sight = interaction.options.getString("sight");
        var range = interaction.options.getString("range");
        var far = interaction.options.getString("far");

        userProfile.user[0].activeParty = [clash, sight, range, far];

        await UserStats.findOneAndUpdate({userId: interaction.user.id},
            {
                user: userProfile.user
            });


        //Send Embed
        const squadrentembed = new EmbedBuilder()
            .setTitle("Active Party is Set!")
            .setDescription("You have successfully changed your party")
            .setThumbnail(interaction.user.avatarURL())
            .setColor(0x101526)
            .setTimestamp();
        await interaction.editReply({content: "Done!", embeds: [squadrentembed]});

	},
};