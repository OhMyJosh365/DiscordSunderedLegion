const mongoose = require("mongoose");
const UserStats = require('../../schemas/userStats');
const { EmbedBuilder, REST } = require("discord.js");

module.exports = (client) => {
    client.minuteLaborCalc = async() => {

        var currentTime = new Date().getTime();
        var profiles = await UserStats.find();

        profiles.forEach(player => {

            for(var slotIndex = 1; slotIndex < 6; slotIndex++){

                if(player.user[0].adventureSlots[`slot${slotIndex}`].endTime != null){
                    if(player.user[0].adventureSlots[`slot${slotIndex}`].endTime < currentTime){

                        require(`../../../laborFunctions/${player.user[0].adventureSlots[`slot${slotIndex}`].task}`)
                            .func(client, player, slotIndex);
                        
                    }

                }
            
            }
        });
        

    }
}