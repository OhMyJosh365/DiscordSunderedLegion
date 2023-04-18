const Canvas = require('canvas');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const mongoose = require("mongoose");
const UserStats = require('../../schemas/userStats');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('worldmap')
		.setDescription('Displays the world map!'),


	async execute(interaction, client) {

            try{
            await interaction.editReply("Loading...");

            //Creating Canvas
            const canvas = Canvas.createCanvas(2048, 1536);
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            //Wanted Poster
            const image0  = await Canvas.loadImage(`./src/Images/Maps/worldMap.png`);
            ctx.drawImage(image0, 0, 0, canvas.width, canvas.height);

            //Attachment
            const attachment = new AttachmentBuilder(canvas.toBuffer(), "Can.png");

            //Send Embed
            const squadrentembed = new EmbedBuilder()
            .setTitle("World Map")
            .setThumbnail(interaction.user.avatarURL())
            .setImage("attachment://Can.png")
            .setColor(0x101526)
            .setTimestamp();
            await interaction.editReply({content: "Done!", embeds: [squadrentembed], files: [attachment]});
            }
            catch(err){
                    console.error(err);
            }

        }

}