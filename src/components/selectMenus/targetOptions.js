const UserStats = require('../../schemas/userStats');

module.exports = {
    data: {
        name: 'targetOptions'
    },
    async execute(interaction, client){

        userProfile = await UserStats.findOne({userId: interaction.user.id});
        
        userProfile.battleState[0].Field["curTarget"] = interaction.values[0];

        await UserStats.findOneAndUpdate({userId: interaction.user.id},
            {
                user: userProfile.user,
                army: userProfile.army,
                battleState: userProfile.battleState
            });

        var moveRef = require(`../../../abilityFunctions/${userProfile.battleState[0].Field["curMove"]}`);
        moveRef.execut(interaction, client);
        
    }
}