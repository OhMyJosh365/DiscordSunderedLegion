const Canvas = require('canvas');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const mongoose = require("mongoose");
const UserStats = require('../../schemas/userStats');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('adventureboard')
		.setDescription('Get info about the adventures your squardrents are out on!')
                .addUserOption(option => option.setName("target")
                        .setDescription("Gets Info on Adventures for Selected User")),

	async execute(interaction, client) {
        
        let userProfile;
        if(interaction.options.getUser("target")){
            userProfile = await UserStats.findOne({userId: interaction.options.getUser("target").id})
        }
        else{
            userProfile  = await UserStats.findOne({userId: interaction.user.id})
        }


        if(!userProfile){
            await interaction.editReply(`This user does not have an account`)
        }
        else{
            try{
            //Send Embed
            const adventuresEmbed = new EmbedBuilder()
            .setTitle(userProfile.user[0].username)
            .addFields([
                {
                    name: `${userProfile.user[0].adventureSlots.slot1.available}`,
                    value: `${userProfile.user[0].adventureSlots.slot1.unit}\n${userProfile.user[0].adventureSlots.slot1.unit}\n${userProfile.user[0].adventureSlots.slot1.date}`,
                    inline: true
                },
                {
                    name: `${userProfile.user[0].adventureSlots.slot2.available}`,
                    value: `${userProfile.user[0].adventureSlots.slot2.unit}\n${userProfile.user[0].adventureSlots.slot2.unit}\n${userProfile.user[0].adventureSlots.slot2.date}`,
                    inline: true
                },
                {
                    name: `${userProfile.user[0].adventureSlots.slot3.available}`,
                    value: `${userProfile.user[0].adventureSlots.slot3.unit}\n${userProfile.user[0].adventureSlots.slot3.unit}\n${userProfile.user[0].adventureSlots.slot3.date}`,
                    inline: true
                },
                {
                    name: `${userProfile.user[0].adventureSlots.slot4.available}`,
                    value: `${userProfile.user[0].adventureSlots.slot4.unit}\n${userProfile.user[0].adventureSlots.slot4.unit}\n${userProfile.user[0].adventureSlots.slot4.date}`,
                    inline: true
                },
                {
                    name: `${userProfile.user[0].adventureSlots.slot5.available}`,
                    value: `${userProfile.user[0].adventureSlots.slot5.unit}\n${userProfile.user[0].adventureSlots.slot5.unit}\n${userProfile.user[0].adventureSlots.slot5.date}`,
                    inline: true
                }
            ])
            .setThumbnail(interaction.user.avatarURL())
            .setColor(0x101526)
            .setTimestamp();
            await interaction.editReply({content: "Done!", embeds: [adventuresEmbed]});
            }catch(err){
                console.error(err);
            }
        }

	},
};