const Canvas = require('canvas');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const mongoose = require("mongoose");
const UserStats = require('../../schemas/userStats');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('squadrentinfo')
		.setDescription('Get info about a squadrent in your army!')
                .addStringOption(option => option.setName("format")
                        .setDescription("Either Stats, Skills, or Trades will display that info!")
                        .setRequired(true)
                        .setAutocomplete(true))
                .addStringOption(option => option.setName("species")
                        .setDescription("What Species you would like Info For?")
                        .setRequired(true)
                        .setAutocomplete(true))
                .addUserOption(option => option.setName("target")
                        .setDescription("Gets Info on given Squad for Selected User")),


        async autocomplete(interaction, client){

                const focusedOption = interaction.options.getFocused(true);
                let choices;

		if (focusedOption.name === 'format') {
			choices = ['stats', 'skills', 'trades'];
		}

		if (focusedOption.name === 'species') {
                        var userProfile  = await UserStats.findOne({userId: interaction.user.id});
                        if(!userProfile) return;

                        options = ["undead", "troglodyte", "kolbold", "myconid", "mimic",
                        "oblet", "wisp", "wraith", "misphet", "naga", "elf", "troll",
                        "blight", "giant", "talus", "sprite", "witch", "demon", "quickling",
                        "harpy", "imp", "treant", "gnoll", "goblin", "draenei",
                        "dwarf", "orc", "murlok", "warg",  "dragon"]

                        choices = [];
                        for(var i = 0; i < 30; i++){
                                if(userProfile.army[0][options[i]].info.unlocked || focusedOption.value == options[i]){
                                        choices = choices.concat(options[i])
                                }
                        }
			
		}

                var filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
                       
                if(filtered.length > 25){
                        filtered = filtered.splice(0, 24);
                }
                
                await interaction.respond(
                        filtered.map(choice => ({ name: choice, value: choice }))
                );
        },


	async execute(interaction, client) {
        
        let userProfile;
        if(interaction.options.getUser("target")){
                userProfile = await UserStats.findOne({userId: interaction.options.getUser("target").id})
        }
        else{
                userProfile  = await UserStats.findOne({userId: interaction.user.id})
        }

        var species = interaction.options.getString("species");
        var format = interaction.options.getString("format");
        
        if(!userProfile){
                await interaction.editReply(`This user does not have an account`)
        }
        else if(!userProfile.army[0][species]){
                await interaction.editReply(`Please enter a valid species!\nResponces should be lower case and the species, not the name`)
        }
        else if(!(format == "stats" || format == "skills" || format == "trades")){
                await interaction.editReply(`Please enter a valid format!\nYou may only enter \'stats\', \'skills\', or \'trades\'`)
        }
        else{
                try{
                await interaction.editReply("Loading...");

                //Creating Canvas
                const canvas = Canvas.createCanvas(800, 1000);
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                //Wanted Poster
                const image0  = await Canvas.loadImage(`./src/Images/squardrentCommands/squadrent${format}.png`);
                ctx.drawImage(image0, 0, 0, canvas.width, canvas.height);

                //Title Section
                ctx.font = '50px serif';
                ctx.strokeStyle = 'gray';
                ctx.fillStyle = 'black';
                ctx.lineWidth = 5;
                ctx.strokeText(`${species[0].toUpperCase() + species.substring(1)} Commander`, 100, 320);
                ctx.fillText(`${species[0].toUpperCase() + species.substring(1)} Commander`, 100, 320);
                
                if(userProfile.army[0][species].info.unlocked){
                        
                        ctx.strokeText(`${userProfile.army[0][species].info.title} ${userProfile.army[0][species].info.name}`, 100, 260);
                        ctx.fillText(`${userProfile.army[0][species].info.title} ${userProfile.army[0][species].info.name}`, 100, 260);
                }
                else{
                        var outputStr = "";
                        for(var i = 0; i < userProfile.army[0][species].info.title.length; i++) outputStr += "?";
                        outputStr += " ";
                        for(var i = 0; i < userProfile.army[0][species].info.name.length; i++) outputStr += "?";

                        ctx.strokeText(outputStr, 100, 260);
                        ctx.fillText(outputStr, 100, 260);
                }

                //Filling in Info Boxes
                if(format == "stats"){
                        ctx.font = '60px Sans-serif';
                        ctx.strokeStyle = 'black';
                        ctx.lineWidth = 6;
                        ctx.strokeText(`${userProfile.army[0][species].stats.atk}`, 130, 735);
                        ctx.strokeText(`${userProfile.army[0][species].stats.def}`, 130, 890);
                        ctx.strokeText(`${userProfile.army[0][species].stats.mag}`, 285, 735);
                        ctx.strokeText(`${userProfile.army[0][species].stats.res}`, 285, 890);
                        ctx.strokeText(`${userProfile.army[0][species].stats.acc}`, 450, 735);
                        ctx.strokeText(`${userProfile.army[0][species].stats.spd}`, 450, 890);

                        ctx.fillStyle = 'red';
                        ctx.fillText(`${userProfile.army[0][species].stats.atk}`, 130, 735);
                        ctx.fillText(`${userProfile.army[0][species].stats.def}`, 130, 890);
                        ctx.fillText(`${userProfile.army[0][species].stats.mag}`, 285, 735);
                        ctx.fillText(`${userProfile.army[0][species].stats.res}`, 285, 890);
                        ctx.fillText(`${userProfile.army[0][species].stats.acc}`, 450, 735);
                        ctx.fillText(`${userProfile.army[0][species].stats.spd}`, 450, 890);


                        ctx.font = '30px Sans-serif';
                        ctx.lineWidth = 3;
                        ctx.strokeText(`${userProfile.army[0][species].stats.hp}/${userProfile.army[0][species].stats.maxhp}`, 585, 405);
                        ctx.strokeText(`${userProfile.army[0][species].stats.mp}/${userProfile.army[0][species].stats.maxmp}`, 585, 495);
                        ctx.strokeText(`${userProfile.army[0][species].stats.energy}/${userProfile.army[0][species].stats.maxenergy}`, 585, 585);

                        ctx.fillText(`${userProfile.army[0][species].stats.hp}/${userProfile.army[0][species].stats.maxhp}`, 585, 405);
                        ctx.fillText(`${userProfile.army[0][species].stats.mp}/${userProfile.army[0][species].stats.maxmp}`, 585, 495);
                        ctx.fillText(`${userProfile.army[0][species].stats.energy}/${userProfile.army[0][species].stats.maxenergy}`, 585, 585);

                        ctx.font = '60px Sans-serif';
                        ctx.lineWidth = 6;
                        var squad = userProfile.army[0][species].stats.atk;
                        squad += userProfile.army[0][species].stats.def;
                        squad += userProfile.army[0][species].stats.mag;
                        squad += userProfile.army[0][species].stats.res;
                        squad += userProfile.army[0][species].stats.acc;
                        squad += userProfile.army[0][species].stats.spd;
                        squad += userProfile.army[0][species].stats.hp/5;
                        squad += userProfile.army[0][species].stats.mp/5;
                        ctx.strokeText(`${squad}`, 590, 800);
                        ctx.fillText(`${squad}`, 590, 800);
                }

                else if(format == "skills"){
                        ctx.font = '40px Sans-serif';
                        ctx.strokeStyle = 'gray';
                        ctx.fillStyle = 'black';
                        ctx.lineWidth = 4;

                        ctx.strokeText(`${userProfile.army[0][species].info.class1}`, 130, 430);
                        ctx.strokeText(`${userProfile.army[0][species].info.class2}`, 420, 430);
                        ctx.fillText(`${userProfile.army[0][species].info.class1}`, 130, 430);
                        ctx.fillText(`${userProfile.army[0][species].info.class2}`, 420, 430);

                        ctx.font = '30px Sans-serif';
                        ctx.strokeStyle = 'gray';
                        ctx.lineWidth = 3;
                        ctx.strokeText(`${userProfile.army[0][species].abilities.Clash.name}`, 120, 535);
                        ctx.strokeText(`${userProfile.army[0][species].abilities.Sight.name}`, 120, 650);
                        ctx.strokeText(`${userProfile.army[0][species].abilities.Range.name}`, 120, 760);
                        ctx.strokeText(`${userProfile.army[0][species].abilities.Far.name}`, 120, 870);
                        ctx.strokeText(`${userProfile.army[0][species].abilities.Profession.name}`, 440, 535);
                        ctx.strokeText(`${userProfile.army[0][species].abilities.Commander.name}`, 440, 650);
                        //ctx.strokeText(`${userProfile.army[0][species].abilities.Passive.name}`, 440, 760);
                        ctx.strokeText(`${userProfile.army[0][species].info.heldItem}`, 440, 870);

                        ctx.fillStyle = 'black';
                        ctx.fillText(`${userProfile.army[0][species].abilities.Clash.name}`, 120, 535);
                        ctx.fillText(`${userProfile.army[0][species].abilities.Sight.name}`, 120, 650);
                        ctx.fillText(`${userProfile.army[0][species].abilities.Range.name}`, 120, 760);
                        ctx.fillText(`${userProfile.army[0][species].abilities.Far.name}`, 120, 870);
                        ctx.fillText(`${userProfile.army[0][species].abilities.Profession.name}`, 440, 535);
                        ctx.fillText(`${userProfile.army[0][species].abilities.Commander.name}`, 440, 650);
                        //ctx.fillText(`${userProfile.army[0][species].abilities.Passive.name}`, 440, 760);
                        ctx.fillText(`${userProfile.army[0][species].info.heldItem}`, 440, 870);
                        
                }

                else if(format == "trades"){
                        ctx.font = '60px Sans-serif';
                        ctx.strokeStyle = 'black';
                        ctx.lineWidth = 6;
                        var trades = [
                                "logging",
                                "mining",
                                "skinning",
                                "harvesting",
                                "fishing",
                                
                                "weaponsmith",
                                "armory",
                                "leatherworker",
                                "talioring",
                                "enchanting",

                                "engineering",
                                "jewelcrafting",
                                "whittling",
                                "alchemy",
                                "cooking",

                                "masonry",
                                "trader",
                                "furnishing",
                                "artisan",
                                "inscription"
                        ];
                        var xPoints = [
                                135,
                                300,
                                455,
                                615
                        ];
                        var yPoints = [
                                452,
                                560,
                                668,
                                775,
                                883
                        ];
                        var tradeIndex = 0;
                        for(var x = 0; x < 4; x++){
                                for(var y = 0; y < 5; y++){
                                        if(userProfile.army[0][species].profession[trades[tradeIndex]].growth < 1) ctx.fillStyle = 'red';
                                        else if(userProfile.army[0][species].profession[trades[tradeIndex]].growth > 1) ctx.fillStyle = 'lime';
                                        else ctx.fillStyle = 'orange';
                                        ctx.strokeText(`${Math.floor(userProfile.army[0][species].profession[trades[tradeIndex]].lvl)}`, xPoints[x], yPoints[y]);
                                        ctx.fillText(`${Math.floor(userProfile.army[0][species].profession[trades[tradeIndex++]].lvl)}`, xPoints[x], yPoints[y]);
                                }
                        }
                }

                //Attachment
                const attachment = new AttachmentBuilder(canvas.toBuffer(), "Can.png");

                //Send Embed
                const squadrentembed = new EmbedBuilder()
                .setTitle(userProfile.army[0][species].info.name)
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

	},
};