const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const UserStats = require('../src/schemas/userStats');

func = async (userProfile, interaction, client, slotNum, report) => {

    unit = userProfile.user[0].adventureSlots[`slot${slotNum}`].unit;
    statUps = userProfile.user[0].adventureSlots[`slot${slotNum}`].statUps;
    description = `${userProfile.army[0][unit].info.name}'s Squadrent trained a batch of ${statUps.length}!`
    
    description += `\nThus, the Squadrent recieved the following:\n`

    var stats = {
        "hp" : 0,
        "mp" : 0,
        "atk" : 0,
        "def" : 0,
        "mag" : 0,
        "res" : 0,
        "spd" : 0,
        "acc" : 0,
    }
    for(var i = 0; i < statUps.length; i++){
        stats[statUps[i]]++;
    }

    if(stats.hp > 0){
        description += ` +${stats.hp*5} Health,`;
        userProfile.army[0][unit].stats.hp += stats.hp*5;
        userProfile.army[0][unit].stats.maxhp = userProfile.army[0][unit].stats.hp;
    }
    if(stats.mp > 0){
        description += ` +${stats.mp*5} Mana,`;
        userProfile.army[0][unit].stats.mp += stats.mp*5;
        userProfile.army[0][unit].stats.maxmp = userProfile.army[0][unit].stats.mp;
    }
    if(stats.atk > 0){
        description += ` +${stats.atk} Attack,`;
        userProfile.army[0][unit].stats.atk += stats.atk;
    }
    if(stats.def > 0){
        description += ` +${stats.def} Guard,`;
        userProfile.army[0][unit].stats.def += stats.def;
    }
    if(stats.mag > 0){
        description += ` +${stats.mag} Magic,`;
        userProfile.army[0][unit].stats.mag += stats.mag;
    }
    if(stats.res > 0){
        description += ` +${stats.res} Resist,`;
        userProfile.army[0][unit].stats.res += stats.res;
    }
    if(stats.acc > 0){
        description += ` +${stats.acc} Focus,`;
        userProfile.army[0][unit].stats.acc += stats.acc;
    }
    if(stats.spd > 0){
        description += ` +${stats.spd} Speed,`;
        userProfile.army[0][unit].stats.spd += stats.spd;
    }

    description += ` and +${statUps.length} Energy!`;
    userProfile.army[0][unit].stats.maxenergy += stats.maxenergy;


    //Save Stats
    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user : userProfile.user,
            army : userProfile.army,
        });

    report.push({
        name: '~ Training Hard! ~',
        value: description
    })

}

requirements = async (userProfile, interaction, client, energyMod, species, task, location, slotNum) => {

    userProfile.user[0].adventureSlots[`slot${slotNum}`] = await {
        "unlocked": true,
        "available" : true,
        "unit" : species,
        "task" : task,
        "location" : location,
        "additionalInfo" : {"energyMod" : energyMod}
    }

    await UserStats.findOneAndUpdate({userId: interaction.user.id},
        {
            user: userProfile.user,
            army: userProfile.army
        });


    const modal = new ModalBuilder()
            .setCustomId('recruitmentModal')
            .setTitle(`Who shall join the ranks of the ${species}?`);

        const textInput = new TextInputBuilder()
            .setCustomId('stats')
            .setLabel('Enter as such: HP MP Atk Def Mag Res Acc Spd')
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder().addComponents(textInput));
    
    await interaction.showModal(modal);
    
    
}


module.exports = {func, requirements}