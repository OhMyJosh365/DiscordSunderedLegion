const UserStats = require('../../schemas/userStats');
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { SelectMenuBuilder, ActionRowBuilder, SelectMenuOptionBuilder } = require('discord.js')

module.exports = {
    data: {
        name: 'movementOptions'
    },
    async execute(interaction, client){

        userSelection = interaction.values[0];

        
        if(userSelection == "StarterNo"){

            var userProfile = await UserStats.findOne({userId: interaction.user.id});
    
            userProfile.battleState[0]["Field"]["printFields"] = [{
                name: `^`,
                value: `^`
            }];
            userProfile.battleState[0].Field.curTurn = -1;

            await UserStats.findOneAndUpdate({userId: interaction.user.id},
                {
                    user: userProfile.user,
                    army: userProfile.army,
                    battleState: userProfile.battleState
                });
            
            client.betweenTurns(interaction, client);
    
        }
        else{
            movementDirectory(interaction, client);
        }
    }
}

movementDirectory = async (interaction, client) => {

    var userProfile = await UserStats.findOne({userId: interaction.user.id});
    var userSelection = interaction.values[0];

    if(!userProfile.battleState[0].Field.repositioning){
        userProfile.battleState[0].Field["repositioning"] = {
            "Clash" : null,
            "Sight" : null,
            "Range" : null,
            "Far" : null,
        }
    }

    if(userSelection.includes("To")){
        userProfile.battleState[0].Field["repositioning"][userSelection.substring(userSelection.indexOf("To") +2)] =
        userProfile.battleState[0].Allies[userSelection.substring(0, userSelection.indexOf("To"))];

        if(userProfile.battleState[0].Field["repositioning"].Clash != null &&
           userProfile.battleState[0].Field["repositioning"].Sight != null &&
           userProfile.battleState[0].Field["repositioning"].Range != null &&
           userProfile.battleState[0].Field["repositioning"].Far != null){

            userProfile.battleState[0].Allies = userProfile.battleState[0].Field["repositioning"];
            userProfile.battleState[0].Field["repositioning"] = null;

            userProfile.battleState[0]["Field"]["printFields"] = await [{
                name: `^`,
                value: `^`
            }];

            await UserStats.findOneAndUpdate({userId: interaction.user.id},
                {
                    user: userProfile.user,
                    army: userProfile.army,
                    battleState: userProfile.battleState
                });
            
            return client.betweenTurns(interaction, client);

        }
    }

    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army,
            battleState: userProfile.battleState
        });


    userProfile = await UserStats.findOne({userId: interaction.user.id});


    if(userProfile.battleState[0].Field["repositioning"].Clash == null ||
       userProfile.battleState[0].Field["repositioning"].Sight == null ||
       userProfile.battleState[0].Field["repositioning"].Range == null ||
       userProfile.battleState[0].Field["repositioning"].Far == null){

        var slots = ["Clash", "Sight", "Range", "Far"];
        var slotIndex;
        var options = [{
            label: '^',
            description: `^`,
            value: `^`
        }];

        if(userProfile.battleState[0].Field["repositioning"].Clash == null)
            slotIndex = 0;
        else if(userProfile.battleState[0].Field["repositioning"].Sight == null)
            slotIndex = 1;
        else if(userProfile.battleState[0].Field["repositioning"].Range == null)
            slotIndex = 2;
        else if(userProfile.battleState[0].Field["repositioning"].Far == null)
            slotIndex = 3;


        for(var i = 0; i < 4; i++){

            if(slotIndex > 0){

                if(slotIndex == 1){
                    if(userProfile.battleState[0].Allies[slots[i]].info.name == userProfile.battleState[0].Field["repositioning"].Clash.info.name){
                        continue;
                    }
                }
                if(slotIndex == 2){
                    if(userProfile.battleState[0].Allies[slots[i]].info.name == userProfile.battleState[0].Field["repositioning"].Clash.info.name ||
                        userProfile.battleState[0].Allies[slots[i]].info.name == userProfile.battleState[0].Field["repositioning"].Sight.info.name){
                            continue;
                    }
                }
                if(slotIndex == 3){
                    if(userProfile.battleState[0].Allies[slots[i]].info.name == userProfile.battleState[0].Field["repositioning"].Clash.info.name ||
                        userProfile.battleState[0].Allies[slots[i]].info.name == userProfile.battleState[0].Field["repositioning"].Sight.info.name||
                        userProfile.battleState[0].Allies[slots[i]].info.name == userProfile.battleState[0].Field["repositioning"].Range.info.name){
                            continue;
                    }
                }

            }

            
            options.push({
                label: `${userProfile.battleState[0].Allies[slots[i]].info.name}`,
                description: `Current Lane: ${slots[i]}, ${slots[slotIndex]} Lane Ability: ${
                    require(`../../../abilityFunctions/${
                        userProfile.battleState[0].Allies[slots[i]].abilities[slots[slotIndex]].name
                        }`).displayName
                    }`,
                value: `${slots[i]}To${slots[slotIndex]}`
            });
        }

        var fields = [{
            name: '^',
            value: `^`
        }];
        var desc = "Team Layout so Far:";

        for(var i = 0; i < 4; i++){

            desc += `\n${slots[i]}:`;

            if(userProfile.battleState[0].Field.repositioning[slots[i]] == null){
                desc += " Unassigned";
            }
            else{
                desc += ` ${userProfile.battleState[0].Field.repositioning[slots[i]].info.name},`
                desc += ` ${require(`../../../abilityFunctions/${
                    userProfile.battleState[0].Field.repositioning[slots[i]].abilities[slots[i]].name}`).displayName}`
            }

        }

        for(var i = 0; i < 4; i++){

            if(desc.indexOf(userProfile.battleState[0].Allies[`${slots[i]}`].info.name) != -1){
                continue;
            }

            var abilityValue;

            abilityValue = `Clash: ${require(`../../../abilityFunctions/${
                userProfile.battleState[0].Allies[slots[i]].abilities.Clash.name}`).displayName}`;
            abilityValue += `\nSight: ${require(`../../../abilityFunctions/${
                userProfile.battleState[0].Allies[slots[i]].abilities.Sight.name}`).displayName}`;
            abilityValue += `\nRange: ${require(`../../../abilityFunctions/${
                userProfile.battleState[0].Allies[slots[i]].abilities.Range.name}`).displayName}`;
            abilityValue += `\nFar: ${require(`../../../abilityFunctions/${
                userProfile.battleState[0].Allies[slots[i]].abilities.Far.name}`).displayName}`;


            fields.push({
                name : `${`~${userProfile.battleState[0].Allies[`${slots[i]}`].info.name}'s Abilities`}`,
                value: abilityValue
            })

        }

        options.shift();
        fields.shift();

        const squadrentembed = new EmbedBuilder()
            .setTitle(`Movement Phase!`)
            .setDescription(desc)
            .addFields(fields)
            .setColor(0x101526)
            .setTimestamp();

        
        const menu = new SelectMenuBuilder()
            .setPlaceholder(`Who should move into the '${slots[slotIndex]}' lane?`)
            .setCustomId('movementOptions')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(options)

        return await interaction.editReply({content: "Done!", embeds: [squadrentembed], components: [new ActionRowBuilder().addComponents(menu)]});
    
    }

    
}