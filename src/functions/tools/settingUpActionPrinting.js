const { SelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const UserStats = require('../../schemas/userStats');

module.exports = (client) => {
    client.settingUpActionPrinting = async(interaction, client, desc, curSlot, userTeam) => {

        userProfile = await UserStats.findOne({userId: interaction.user.id});

        var between = false;
        if(!userProfile.battleState[0].Field["printFields"]){
            userProfile.battleState[0].Field["printFields"] = [{
                name: `${`~${userProfile.battleState[0][userTeam][`${curSlot}`].info.name}'s Turn`}`,
                value: `${desc}`
            }]
        }
        else{
            userProfile.battleState[0].Field["printFields"].push({
                name: `${`~${userProfile.battleState[0][userTeam][`${curSlot}`].info.name}'s Turn`}`,
                value: `${desc}`
            })
            between = true;
        }
        
        await UserStats.findOneAndUpdate({userId: interaction.user.id},
            {
                user: userProfile.user,
                army: userProfile.army,
                battleState: userProfile.battleState
            });

        if(!between){
            client.betweenTurns(interaction, client);
        }

    }
}