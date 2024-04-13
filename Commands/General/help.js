const fs = require('fs');

module.exports = {
    name: 'help',
    description: "Displays the help information",
    async execute(client, message, args, Discord) {
        const { MessageEmbed } = await import('discord.js');

        const boostMonthlyFile = __dirname + "/" + "boostmonthly" + ".json";
        const boostYearlyFile = __dirname + "/" + "boostyearly" + ".json";
        const basicMonthlyFile = __dirname + "/" + "basicmonthly" + ".json";
        const basicYearlyFile = __dirname + "/" + "basicyearly" + ".json";

        const bm = JSON.parse(fs.readFileSync(boostMonthlyFile));
        const by = JSON.parse(fs.readFileSync(boostYearlyFile));
        const cm = JSON.parse(fs.readFileSync(basicMonthlyFile));
        const cy = JSON.parse(fs.readFileSync(basicYearlyFile));

        const thumbnailURL = 'https://example.com/thumbnail.png'; // Replace with your thumbnail URL

        let embed = new MessageEmbed()
            .setTitle('Help Menu')
            .setColor('RANDOM')
            .setThumbnail('https://media.discordapp.net/attachments/1227657507972055042/1228639942796906507/giphy_3.gif?ex=662cc71d&is=661a521d&hm=f290a58068db1e76b20c541d7ba030940af65e36bfd0405e657b594047ac4723&=') // Set the thumbnail here
            .addFields(
                { name: '\u200b', value: 'Please keep in mind that referring to type it means the following: boostmonthly/boostyearly/basicmonthly/basicyearly' },
                { name: 'b!addstock <type> <link>', value: 'Do as it says, please ensure each link is on a new line.' },
                { name: 'b!nitrosend <@user> <type> <amount>', value: 'Sends a specific set of nitros to a user. User must be in server.' },
                { name: 'b!help', value: 'Here to help you!' },
                { name: 'b!stock', value: `Boost Monthly: ${bm.length}\nBoost Yearly: ${by.length}\nBasic Monthly: ${cm.length}\nBasic Yearly: ${cy.length}` },
            )
            .setFooter('Nitro Stock Bot | Cassajin');

        message.channel.send(embed);
    }
}
