const mongoose = require("mongoose");
const Canvas = require('canvas');
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { SelectMenuBuilder, ActionRowBuilder, SelectMenuOptionBuilder } = require('discord.js')
const UserStats = require('../../schemas/userStats');

module.exports = (client) => {
    client.battleScreen = async(interaction, client) => {

        userProfile = await UserStats.findOne({userId: interaction.user.id});
        var positions = ["Far", "Range", "Sight", "Clash"];

        //Creating Canvas
        const canvas = Canvas.createCanvas(960, 540);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Battlefield
        const image0  = await Canvas.loadImage(`./src/Images/Battle/battlefield3.png`);
        ctx.drawImage(image0, 0, 0, canvas.width, canvas.height);

        //Ally Information
        ctx.font = 'bold 11px serif';
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';

        for(var i = 0; i < 4; i++){
            //Font
            ctx.font = 'bold 11px serif';
            ctx.strokeStyle = 'black';
            ctx.fillStyle = 'white';

            //Profile Picture
            imageBattle = await Canvas.loadImage(`./src/Images/AllyCharacterSprites/${userProfile.battleState[0].Allies[positions[i]].info.title} Commander.png`);
            ctx.drawImage(imageBattle, 15+(i*114), 380, 100, 100);

            //Name
            var printName;
            if(`${userProfile.battleState[0].Allies[positions[i]].info.title} ${userProfile.battleState[0].Allies[positions[i]].info.name}`.length > 15)
                printName = (`${userProfile.battleState[0].Allies[positions[i]].info.title} ${userProfile.battleState[0].Allies[positions[i]].info.name}`).substr(0, 14) + ".";
            else printName = `${userProfile.battleState[0].Allies[positions[i]].info.title} ${userProfile.battleState[0].Allies[positions[i]].info.name}`;

            ctx.strokeText(`${printName}`, 16+(i*114), 495);
            ctx.fillText(`${printName}`, 16+(i*114), 495);

            //HP and MP
            ctx.fillStyle = '#B2E2F0';
            ctx.strokeText(`HP:`, 16+(i*114), 516);
            ctx.fillText(`HP:`, 16+(i*114), 516);
            ctx.strokeText(`MP:`, 16+(i*114), 531);
            ctx.fillText(`MP:`, 16+(i*114), 531);

            ctx.beginPath();
            ctx.rect(41+(i*114), 514, 70, 3);
            ctx.fillStyle = "#FFB346";
            ctx.fill();
            ctx.beginPath();
            ctx.rect(41+(i*114), 530, 70, 3);
            ctx.fillStyle = "#A37AC2";
            ctx.fill();

            ctx.font = 'bold 13px serif';
            ctx.strokeStyle = 'black';
            ctx.fillStyle = 'lime';
            var hpText = `${userProfile.battleState[0].Allies[positions[i]].stats.hp}/${userProfile.battleState[0].Allies[positions[i]].stats.maxhp}`;
            ctx.strokeText(hpText, 57+(i*114)+((7-hpText.length)*9), 510);
            ctx.fillText(hpText, 57+(i*114)+((7-hpText.length)*9), 510);
            var hpText = `${userProfile.battleState[0].Allies[positions[i]].stats.mp}/${userProfile.battleState[0].Allies[positions[i]].stats.maxmp}`;
            ctx.strokeText(hpText, 57+(i*114)+((7-hpText.length)*9), 527);
            ctx.fillText(hpText, 57+(i*114)+((7-hpText.length)*9), 527);


            //Class Shield
            var imageBattle = await Canvas.loadImage(`./src/Images/BattleIcons/${userProfile.battleState[0].Allies[positions[i]].info.class1}.jpg`);
            ctx.drawImage(imageBattle, 6+(i*116), 390, 30, 30);
        }



        //Enemies Information
        ctx.font = 'bold 11px serif';
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';

        for(var i = 0; i < 4; i++){
            //Font
            ctx.font = 'bold 11px serif';
            ctx.strokeStyle = 'black';
            ctx.fillStyle = 'white';

            //Profile Picture
            imageBattle = await Canvas.loadImage(`./src/Images/EnemyCharacterSprites/${userProfile.battleState[0].Enemies[positions[i]].info.title} Commander.png`);
            ctx.drawImage(imageBattle, 506+(i*115), 380, 100, 100);

            //Name
            var printName;
            if(`${userProfile.battleState[0].Enemies[positions[i]].info.title} ${userProfile.battleState[0].Enemies[positions[i]].info.name}`.length > 15)
                printName = (`${userProfile.battleState[0].Enemies[positions[i]].info.title} ${userProfile.battleState[0].Enemies[positions[i]].info.name}`).substr(0, 14) + ".";
            else printName = `${userProfile.battleState[0].Enemies[positions[i]].info.title} ${userProfile.battleState[0].Enemies[positions[i]].info.name}`;

            ctx.strokeText(`${printName}`, 508+(i*115), 495);
            ctx.fillText(`${printName}`, 508+(i*115), 495);

            //HP and MP
            ctx.fillStyle = '#B2E2F0';
            ctx.strokeText(`HP: `, 508+(i*115), 516);
            ctx.fillText(`HP: `, 508+(i*115), 516);
            ctx.strokeText(`MP: `, 508+(i*115), 531);
            ctx.fillText(`MP: `, 508+(i*115), 531);

            ctx.beginPath();
            ctx.rect(535+(i*114), 514, 70, 3);
            ctx.fillStyle = "#FFB346";
            ctx.fill();
            ctx.beginPath();
            ctx.rect(535+(i*114), 530, 70, 3);
            ctx.fillStyle = "#A37AC2";
            ctx.fill();

            ctx.font = 'bold 13px serif';
            ctx.strokeStyle = 'black';
            ctx.fillStyle = 'lime';
            var hpText = `${Math.floor(100*(userProfile.battleState[0].Enemies[positions[i]].stats.hp/userProfile.battleState[0].Enemies[positions[i]].stats.maxhp))}%`;
            ctx.strokeText(hpText, 540+(i*114)+((7-hpText.length)*9), 510);
            ctx.fillText(hpText, 540+(i*114)+((7-hpText.length)*9), 510);


            //Class Shield
            var imageBattle = await Canvas.loadImage(`./src/Images/BattleIcons/${userProfile.battleState[0].Enemies[positions[i]].info.class}.jpg`);
            ctx.drawImage(imageBattle, 577+(i*116), 390, 30, 30);
        }


        //Battle Sprites
        if(userProfile.battleState[0].Allies.Clash.stats.hp > 0){
            var imageBattle = await Canvas.loadImage(`./src/Images/AllyCharacterSprites/${userProfile.battleState[0].Allies.Clash.info.title} Minion.png`);
            ctx.drawImage(imageBattle, 346, 225, 80, 80);
            ctx.drawImage(imageBattle, 386, 233, 80, 80);

            ctx.drawImage(imageBattle, 346, 266, 80, 80);
            ctx.drawImage(imageBattle, 386, 274, 80, 80);

            ctx.drawImage(imageBattle, 346, 306, 80, 80);
            ctx.drawImage(imageBattle, 386, 315, 80, 80);
        }
        
        if(userProfile.battleState[0].Allies.Sight.stats.hp > 0){
            imageBattle = await Canvas.loadImage(`./src/Images/AllyCharacterSprites/${userProfile.battleState[0].Allies.Sight.info.title} Minion.png`);
            ctx.drawImage(imageBattle, 235, 227, 80, 80);
            ctx.drawImage(imageBattle, 270, 237, 80, 80);

            ctx.drawImage(imageBattle, 235, 263, 80, 80);
            ctx.drawImage(imageBattle, 268, 272, 80, 80);

            ctx.drawImage(imageBattle, 235, 294, 80, 80);
            ctx.drawImage(imageBattle, 268, 303, 80, 80);
        }
        
        if(userProfile.battleState[0].Allies.Range.stats.hp > 0){
            imageBattle = await Canvas.loadImage(`./src/Images/AllyCharacterSprites/${userProfile.battleState[0].Allies.Range.info.title} Minion.png`);
            ctx.drawImage(imageBattle, 115, 237, 80, 80);
            ctx.drawImage(imageBattle, 150, 247, 80, 80);

            ctx.drawImage(imageBattle, 115, 273, 80, 80);
            ctx.drawImage(imageBattle, 148, 282, 80, 80);

            ctx.drawImage(imageBattle, 115, 304, 80, 80);
            ctx.drawImage(imageBattle, 148, 313, 80, 80);
        }
        
        if(userProfile.battleState[0].Allies.Far.stats.hp > 0){
            imageBattle = await Canvas.loadImage(`./src/Images/AllyCharacterSprites/${userProfile.battleState[0].Allies.Far.info.title} Minion.png`);
            ctx.drawImage(imageBattle, 8, 140, 80, 80);
            ctx.drawImage(imageBattle, 40, 148, 80, 80);

            ctx.drawImage(imageBattle, 8, 218, 80, 80);
            ctx.drawImage(imageBattle, 40, 227, 80, 80);

            ctx.drawImage(imageBattle, 8, 249, 80, 80);
            ctx.drawImage(imageBattle, 40, 258, 80, 80);
        }
        
        if(userProfile.battleState[0].Enemies.Far.stats.hp > 0){
            imageBattle = await Canvas.loadImage(`./src/Images/EnemyCharacterSprites/${userProfile.battleState[0].Enemies.Far.info.title} Minion.png`);
            ctx.drawImage(imageBattle, 490, 230, 120, 120);
        }
        if(userProfile.battleState[0].Enemies.Range.stats.hp > 0){
            imageBattle = await Canvas.loadImage(`./src/Images/EnemyCharacterSprites/${userProfile.battleState[0].Enemies.Range.info.title} Minion.png`);
            ctx.drawImage(imageBattle, 600, 280, 120, 120);    
        }
        if(userProfile.battleState[0].Enemies.Sight.stats.hp > 0){
            imageBattle = await Canvas.loadImage(`./src/Images/EnemyCharacterSprites/${userProfile.battleState[0].Enemies.Sight.info.title} Minion.png`);
            ctx.drawImage(imageBattle, 715, 240, 120, 120);
        }
        if(userProfile.battleState[0].Enemies.Clash.stats.hp > 0){
            imageBattle = await Canvas.loadImage(`./src/Images/EnemyCharacterSprites/${userProfile.battleState[0].Enemies.Clash.info.title} Minion.png`);
            ctx.drawImage(imageBattle, 835, 130, 120, 120);
        }
        

        //Army Banners
        ctx.font = 'bold 12px serif';
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.strokeText(`${userProfile.user[0].username}'s Army`, 3, 24);
        ctx.fillText(`${userProfile.user[0].username}'s Army`, 3, 24);
        var armyPower = 
            getPower(userProfile.battleState[0].Allies.Clash.stats)
            + getPower(userProfile.battleState[0].Allies.Sight.stats)
            + getPower(userProfile.battleState[0].Allies.Range.stats)
            + getPower(userProfile.battleState[0].Allies.Far.stats);
        ctx.strokeText(`Army Power:   ${armyPower}`, 5, 107);
        ctx.fillText(`Army Power:   ${armyPower}`, 5, 107);

        ctx.strokeText(`Heroes of ${userProfile.user[0].curLocation}`, 825, 24);
        ctx.fillText(`Heroes of ${userProfile.user[0].curLocation}`, 825, 24);
        armyPower = 
            getPower(userProfile.battleState[0].Enemies.Clash.stats)
            + getPower(userProfile.battleState[0].Enemies.Sight.stats)
            + getPower(userProfile.battleState[0].Enemies.Range.stats)
            + getPower(userProfile.battleState[0].Enemies.Far.stats);
        ctx.strokeText(`Army Power:   ${armyPower}`, 835, 107);
        ctx.fillText(`Army Power:   ${armyPower}`, 835, 107);

        var avatar = interaction.user.avatarURL().replace('webp','png');
        img = await Canvas.loadImage(avatar);
        ctx.drawImage(img, 38, 33, 57, 57);
        ctx.restore();


        //Turn Orders
        ctx.font = 'bold 15px arial';
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'black';
        for(var i = 0; i < 8; i++){
            var turnImage;
            var curID = userProfile.battleState[0].TurnOrder[i];
            var teamTurn = (curID <= 4) ? "Allies" : "Enemies";
            var teamFile = (curID <= 4) ? "Ally" : "Enemy";

            turnImage = await Canvas.loadImage(`./src/Images/BattleIcons/${teamFile}TurnFlag.png`);;
            ctx.drawImage(turnImage, 224+(65*i), 0, 56, 70);
            ctx.strokeText(`${i+1}`, 248+(65*i), 67);
            ctx.fillText(`${i+1}`, 248+(65*i), 67);

            for(var j = 0; j < 4; j++){
                if(userProfile.battleState[0][teamTurn][positions[j]].battleMods.battleID == curID){
                    turnImage = await Canvas.loadImage(`./src/Images/${teamFile}CharacterSprites/${userProfile.battleState[0][teamTurn][positions[j]].info.title} Commander.png`);
                }
            }

            ctx.drawImage(turnImage, 226+(65*i), 1, 50, 50);
        }


        //Move List
        var currentTurn = userProfile.battleState[0].Field.curTurn;
        var currentTurn = userProfile.battleState[0].TurnOrder[currentTurn];

        for(var ally in userProfile.battleState[0].Allies){
            if(userProfile.battleState[0].Allies[ally].battleMods.battleID == currentTurn){
                curSlot = ally;
                break;
            }
        }

        var i = 0;
        var options = [];
        
        var professionRef = require(`../../../abilityFunctions/${userProfile.battleState[0].Allies[curSlot].abilities.Profession.name}`);
        if(professionRef.mpCost <= userProfile.battleState[0].Allies[curSlot].stats.mp){
            options[i++] = {
                label: `${professionRef.displayName}`,
                description: `${professionRef.description}`,
                value: `${userProfile.battleState[0].Allies[curSlot].abilities.Profession.name}`
            }
        }

        var laneRef = require(`../../../abilityFunctions/${userProfile.battleState[0].Allies[curSlot].abilities[curSlot].name}`);
        if(laneRef.mpCost <= userProfile.battleState[0].Allies[curSlot].stats.mp){
            options[i++] = {
                label: `${laneRef.displayName}`,
                description: `${laneRef.description}`,
                value: `${userProfile.battleState[0].Allies[curSlot].abilities[curSlot].name}`
            }
        }

        var commanderRef = require(`../../../abilityFunctions/${userProfile.battleState[0].Allies[curSlot].abilities.Commander.name}`);
        if(commanderRef.mpCost <= userProfile.battleState[0].Allies[curSlot].stats.mp){
            options[i++] = {
                label: `${commanderRef.displayName}`,
                description: `${commanderRef.description}`,
                value: `${userProfile.battleState[0].Allies[curSlot].abilities.Commander.name}`
            }
        }

        var restRef = require(`../../../abilityFunctions/ShortRest`)
        options[i++] = {
            label: `${restRef.displayName}`,
            description: `${restRef.description}`,
            value: `ShortRest`
        }

        const menu = new SelectMenuBuilder()
        .setPlaceholder(`What should ${userProfile.battleState[0].Allies[curSlot].info.name} do?`)
        .setCustomId('battleOptions')
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(options)

        //Attachment
        const attachment = new AttachmentBuilder(canvas.toBuffer(), "Can.png");

        var embed;

        if(userProfile.battleState[0].Field.printFields != null){

            if(userProfile.battleState[0].Field.printFields[0].name == "^"){
                userProfile.battleState[0].Field.printFields.shift();
            }

            embed = new EmbedBuilder()
                .setTitle(`It's ${userProfile.battleState[0].Allies[curSlot].info.name} Turn!`)
                .addFields(userProfile.battleState[0].Field.printFields)
                .setThumbnail(interaction.user.avatarURL())
                .setImage("attachment://Can.png")
                .setColor(0x101526)
                .setTimestamp();

            userProfile.battleState[0].Field["printFields"] = null;

            await UserStats.findOneAndUpdate({userId: interaction.user.id},
                {
                    user: userProfile.user,
                    army: userProfile.army,
                    battleState: userProfile.battleState
                });
        }
        else{
            
            embed = new EmbedBuilder()
                .setTitle(`It's ${userProfile.battleState[0].Allies[curSlot].info.name} Turn!`)
                .setThumbnail(interaction.user.avatarURL())
                .setImage("attachment://Can.png")
                .setColor(0x101526)
                .setTimestamp();
        }

        const squadrentembed = embed;

        if(interaction.update){
            squadrentembed.setDescription("In-Between Turns, here's What Happened");
            await interaction.editReply({content: "Done!", embeds: [squadrentembed], files: [attachment], components: [new ActionRowBuilder().addComponents(menu)]});
        }
        else{
            await interaction.editReply({content: "Done!", embeds: [squadrentembed], files: [attachment], components: [new ActionRowBuilder().addComponents(menu)]});
        }
        
    }
}

function getPower(allyStats){

    if(allyStats.hp <= 0){
        return 0;
    }

    var power = allyStats.atk;
    power += allyStats.def;
    power += allyStats.mag;
    power += allyStats.res;
    power += allyStats.acc;
    power += allyStats.spd;
    power += allyStats.maxhp/5;
    power += allyStats.maxmp/5;
    return power;
}