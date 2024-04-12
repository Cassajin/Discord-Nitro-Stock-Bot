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

        let embed = new MessageEmbed()
            .setTitle('Help Menu')
            .setColor('RANDOM')
            .addFields(
                { name: '\u200b', value: 'Please keep in mind that referring to type it means the following: boostmonthly/boostyearly/basicmonthly/basicyearly' },
                { name: 'addstock <type> <paste-codes>', value: 'Does as it says, please ensure each new code is on a new line.' },
                { name: 'nitro <user> <type> <amount>', value: 'Sends a specific set of nitros to a user. User must be in server.' },
                { name: 'help', value: 'Got you here.' },
                { name: 'stock', value: `Boost Monthly: ${bm.length}\nBoost Yearly: ${by.length}\nBasic Monthly: ${cm.length}\nBasic Yearly: ${cy.length}` },
            )
            .setFooter('Nitro Stock Bot | Cassajin');

        message.channel.send(embed);
    }
}
