module.exports = {
    name: 'addstock',
    description: "Add nitro stock command.",
    async execute(client, message, args, Discord) {
        const fs = require('fs');

        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new Discord.MessageEmbed()
            .setTitle('Error!')
            .setDescription('You do not have ADMINISTRATOR permissions.')
        );

        fs.readFile(__dirname + "/" + args[0].toLowerCase() + ".json", function (err, data) {
            let og = args.slice(1).toString();
            let codess = og.split('\n');

            if (err) {
                let error = new Discord.MessageEmbed()
                    .setTitle('Error')
                    .setDescription('There seems to have been a problem adding to stock. Check your spelling and try again.')
                    .setColor('RED');
                message.channel.send(error);
            } else {
                data = JSON.parse(data);
                for (var i = 0; i < codess.length; i++) {
                    let newData = { "Gift_Type": args[0], "Gift_Link": codess[i] };
                    try {
                        data.push(newData);
                        fs.writeFileSync(__dirname + "/" + args[0].toLowerCase() + ".json", JSON.stringify(data));

                    } catch {
                        message.channel.send('An error has occurred!');
                    }
                }
                const successImageURL = 'https://media.discordapp.net/attachments/1227602786150252595/1228376737906425968/giphy_2.gif?ex=662bd1fc&is=66195cfc&hm=c3ee0d45322a0c0edf508bbbf997411578bef446056bfa9d40125b8813b35b24&='; // Replace with your success image or GIF URL
                const successEmbed = new Discord.MessageEmbed()
                    .setTitle(':white_check_mark: Stock Added!')
                    .setColor('GREEN')
                    .setDescription('Nitro has been added to the stock!')
                    .setThumbnail(successImageURL)
                message.channel.send(successEmbed);
            }
        });
    }
};
