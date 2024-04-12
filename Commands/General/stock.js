module.exports = {
    name: 'stock',
    aliases: ['inv', 'nitros'],
    description: "Grabs the stock for json",
    async execute(client, message, args, Discord) {
        const fs = require('fs');

        // Read the JSON files
        const basicMonthly = JSON.parse(fs.readFileSync(__dirname + "/" + "basicmonthly" + ".json"));
        const boostMonthly = JSON.parse(fs.readFileSync(__dirname + "/" + "boostmonthly" + ".json"));
        const basicYearly = JSON.parse(fs.readFileSync(__dirname + "/" + "basicyearly" + ".json"));
        const boostYearly = JSON.parse(fs.readFileSync(__dirname + "/" + "boostyearly" + ".json"));

        // Dynamic import for node-fetch
        const fetch = await import('node-fetch');

        // Function to fetch nitro link status
        async function getNitroStatus(nitroLink) {
            const nitroCode = nitroLink.split('/').pop();
            const response = await fetch.default(`https://discord.com/api/v8/entitlements/gift-codes/${nitroCode}`);
            const data = await response.json();

            if (response.ok) {
                const expirationTimestamp = new Date(data.expires_at).getTime();
                const currentTimestamp = Date.now();
                const remainingHours = Math.max(0, Math.ceil((expirationTimestamp - currentTimestamp) / (1000 * 60 * 60)));

                let status;
                if (data.claimed_at) {
                    status = "Claimed";
                } else if (expirationTimestamp < currentTimestamp) {
                    status = "Expired";
                } else {
                    status = `Expires in ${remainingHours} hours`;
                }

                return status;
            } else {
                return "Failed to fetch status";
            }
        }

        // Fetch nitro status for each link
        const nitroStatusesMonthly = await Promise.all(
            boostMonthly.map(async (nitroLink, index) => {
                const status = await getNitroStatus(nitroLink.Gift_Link);
                return `${index + 1}. ${nitroLink.Gift_Link} - ${status}`;
            })
        );

        const nitroStatusesYearly = await Promise.all(
            boostYearly.map(async (nitroLink, index) => {
                const status = await getNitroStatus(nitroLink.Gift_Link);
                return `${index + 1}. ${nitroLink.Gift_Link} - ${status}`;
            })
        );

        const nitroStatusesBasicMonthly = await Promise.all(
            basicMonthly.map(async (nitroLink, index) => {
                const status = await getNitroStatus(nitroLink.Gift_Link);
                return `${index + 1}. ${nitroLink.Gift_Link} - ${status}`;
            })
        );

        const nitroStatusesBasicYearly = await Promise.all(
            basicYearly.map(async (nitroLink, index) => {
                const status = await getNitroStatus(nitroLink.Gift_Link);
                return `${index + 1}. ${nitroLink.Gift_Link} - ${status}`;
            })
        );

        // Create the embed message
        const embed = new Discord.MessageEmbed()
            .setTitle('Current Stock')
            .setColor('GREEN')
            .setDescription("Nitro Links Status:");

        // Check if the arrays are not empty and add them to the embed
        if (nitroStatusesMonthly.length > 0) {
            embed.addField('Boosts (Monthly)', nitroStatusesMonthly.join('\n'));
        }
        if (nitroStatusesYearly.length > 0) {
            embed.addField('Boosts (Yearly)', nitroStatusesYearly.join('\n'));
        }
        if (nitroStatusesBasicMonthly.length > 0) {
            embed.addField('Basics (Monthly)', nitroStatusesBasicMonthly.join('\n'));
        }
        if (nitroStatusesBasicYearly.length > 0) {
            embed.addField('Basics (Yearly)', nitroStatusesBasicYearly.join('\n'));
        }

        embed.setFooter('Nitro Stock Bot | Made by Cassajin');

        message.channel.send(embed);
    }
}
