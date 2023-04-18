const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const UserStats = require('../../schemas/userStats');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('viewinventory')
        .setDescription('Check out your gold as well as everything else in your bag!')
        .addStringOption(option => option.setName("page")
            .setDescription("Select what 50 items should be displayed. Default is 1-50")
            .setRequired(true)
            .setAutocomplete(true))
        .addStringOption(option => option.setName("keyword")
            .setDescription("Search for a specific word in your bag. Selecting this cancels out page and picks first 50.")
            .setAutocomplete(true))
        .addStringOption(option => option.setName("hidden")
            .setDescription("Would you like to hide this from chat? True/False")
            .setAutocomplete(true)),

    async autocomplete(interaction, client){

        const focusedOption = interaction.options.getFocused(true);
        let choices;

		if (focusedOption.name === 'page') {
            var userProfile  = await UserStats.findOne({userId: interaction.user.id});
            if(!userProfile) return;

            choices = ['1-50'];
            for(var i = 50; i < userProfile.inventory[0].length; i+=50){
                choices = choices.concat(`${i}-${i+50}`);
            }
        }

        if (focusedOption.name === 'keyword') {
            var userProfile  = await UserStats.findOne({userId: interaction.user.id});
            if(!userProfile) return;
            choices = [];

            for (let i in userProfile.inventory[0]) {
                choices = choices.concat(i);
            }
        }

        if (focusedOption.name === 'hidden') {
            choices = ['true', 'false'];
        }

        var filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
                       
        if(filtered.length > 25){
                filtered = filtered.splice(0, 24);
        }
        
        await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice }))
        );
    },

    async execute(interaction, client){
        
        userProfile = await UserStats.findOne({userId: interaction.user.id});

        //Getting Options
        var options = userProfile.inventory[0];
        var page = [];

        if(interaction.options.getString("keyword")){
            var trim = [];
            for (let i in options) {
                trim = trim.concat(i);
            }
            trim = trim.filter(choice => choice.startsWith(interaction.options.getString("keyword")));
            
            var trimed = [];
            for (let i in trim) {
                trimed[trim[i]] = userProfile.inventory[0][trim[i]];
            }

            options = trimed;
            page = [1, 50]
        }

        else{
            page = interaction.options.getString("page").split('-');
        }
        

        //Building Description
        var inventor = `~ Total Gold : ${userProfile.user[0].gold}`;

        var pageCount = 1;
        for (let i in options) {
            if(pageCount >= page[0] || pageCount <= page[1]){
                inventor += `\n~ ${i} : ${options[i]}`;
            }
            pageCount++;
        }

        //Show inventory
        var hidden = false;
        if(interaction.options.getString("hidden") == 'true'){ hidden = true }

        const adventuresEmbed = new EmbedBuilder()
            .setTitle(`${userProfile.user[0].username}'s Inventory!`)
            .setDescription(inventor)
            .setThumbnail(interaction.user.avatarURL())
            .setColor(0x101526)
            .setTimestamp();
        await interaction.editReply({content: "Done!", embeds: [adventuresEmbed], ephemeral: hidden});
    } 
}