const { InteractionType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const UserStats = require('../../schemas/userStats');
const mongoose = require("mongoose");
const createPlayer = require('../../functions/tools/createPlayer');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if(interaction.user.bot) return;

        var userProfile = await UserStats.findOne({userId: interaction.user.id})

        //Autocomplete Checker
        if(interaction.type == InteractionType.ApplicationCommandAutocomplete){
            
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return;

            try{
                await command.autocomplete(interaction, client);
            }catch(err){
                console.error(err);
            }
            return;
        }

        if(interaction.update) await interaction.deferUpdate();
        else await interaction.deferReply();

        //No profile -> gets one
        if(!userProfile){
            await client.createPlayer(interaction, client);
        }

        //All other cases below
        else if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return;
            
            try {
                await command.execute(interaction, client);
            }
            catch (error) {
                console.error(error);
            }
        }

        else if(interaction.isButton()){
            const {buttons} = client;
            const {customId} = interaction;
            const button = buttons.get(customId);
            if(!button) return new Error("There is no code for this button!");

            try{
                await button.execute(interaction,client);
            }
            catch(error) {
                console.error(error);
            }
        }

        else if(interaction.isSelectMenu()){
            const { selectMenus } = client;
            const { customId } = interaction;
            const menu = selectMenus.get(customId);
            if(!menu) return new Error("There is no code for this menu");

            try{
                await menu.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }
        }

        else if(interaction.isUserContextMenuCommand()){
            const { commands } = client;
            const { commandName } = interaction;
            const contextCommand = commands.get(commandName);
            if(!contextCommand) return;

            try{
                await contextCommand.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }
        }

        else if(interaction.type = InteractionType.ModalSubmit) {
            const { modals } = client;
            const { customId } = interaction;
            const modal = modals.get(customId);
            if(!modal) return new Error("There is no code for this modal.");

            try{
                await modal.execute(interaction, client);
            } catch (error){
                console.error(error);
            }
        }

    }
}