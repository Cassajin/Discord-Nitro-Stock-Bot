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
    .setColor('#2C2F33')
    .setDescription("Nitro Links Status:")
    .setThumbnail('https://media.discordapp.net/attachments/1227602786150252595/1228374144907743403/giphy_1.gif?ex=662bcf92&is=66195a92&hm=66c1355465b669fe1c6fb08548089037ebbf1f68b143e4fbc1f027f87ea0098d&=');

// Emojis (replace 'BOOST_EMOJI_ID' and 'BASIC_EMOJI_ID' with actual emoji IDs)
const boostEmoji = client.emojis.cache.get('1228372795256475668');
const basicEmoji = client.emojis.cache.get('1228372938311471216');

// Check if the arrays are not empty and add them to the embed with emojis
if (nitroStatusesMonthly.length > 0) {
    embed.addField(`${boostEmoji} Boosts (Monthly)`, nitroStatusesMonthly.join('\n'));
}
if (nitroStatusesYearly.length > 0) {
    embed.addField(`${boostEmoji} Boosts (Yearly)`, nitroStatusesYearly.join('\n'));
}
if (nitroStatusesBasicMonthly.length > 0) {
    embed.addField(`${basicEmoji} Basics (Monthly)`, nitroStatusesBasicMonthly.join('\n'));
}
if (nitroStatusesBasicYearly.length > 0) {
    embed.addField(`${basicEmoji} Basics (Yearly)`, nitroStatusesBasicYearly.join('\n'));
}

embed.setFooter('Nitro Stock Bot | Made by Cassajin');

message.channel.send(embed);
    }
}
