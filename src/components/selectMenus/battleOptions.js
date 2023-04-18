const UserStats = require('../../schemas/userStats');

module.exports = {
    data: {
        name: 'battleOptions'
    },
    async execute(interaction, client){

        userProfile = await UserStats.findOne({userId: interaction.user.id});
        userProfile.battleState[0].Field["curMove"] = interaction.values[0];

        await UserStats.findOneAndUpdate({userId: interaction.user.id},
            {
                user: userProfile.user,
                army: userProfile.army,
                battleState: userProfile.battleState
            });

        var moveRef = require(`../../../abilityFunctions/${interaction.values[0]}`);

        if(moveRef.targeting){
            moveRef.targeting(interaction, client);
        }
        else{
            moveRef.execut(interaction, client);
        }

        

        
    }
}