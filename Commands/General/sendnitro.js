module.exports = {
    name: 'sendnitro',
    description: "Sends nitro to a designated user",
    async execute(client, message, args, Discord) {
        if (!args[0] || !args[1] || !args[2]) {
            return message.channel.send("Usage: !sendnitro <@user> <type> <amount>");
        }

        const user = message.mentions.members.first();
        if (!user) {
            return message.channel.send("User not found! Please mention a user.");
        }

        const type = args[1].toLowerCase();
        const amount = parseInt(args[2]);

        if (isNaN(amount) || amount <= 0) {
            return message.channel.send("Invalid amount. Please provide a positive number.");
        }

        const stockFile = __dirname + "/" + type + ".json";
        const stockData = require(stockFile);

        if (stockData.length < amount) {
            return message.channel.send(`Not enough nitro in stock for ${type}.`);
        }

        const nitrosToSend = stockData.splice(0, amount);

        // Update the stock file
        require('fs').writeFileSync(stockFile, JSON.stringify(stockData));

        // Send the nitros to the user with numbering
        let sentNitros = '';
        nitrosToSend.forEach((nitro, index) => {
            const nitroNumber = index + 1;
            sentNitros += `${nitroNumber}. || ${nitro.Gift_Link} ||\n`;
        });

        user.send(`\u200E‎ ‎  ‎ ‎‎/)_/)
   {   . .}
c/づ‎ ‎ [☆](https://discord.gg/sakuwa)  𝓵ove 𝓶ail for 𝓾
‎ ‎  ‎ ‎ ‎  ‎ ‎ ‎  ‎thank you for buying **!**

‎ ‎ ﹒ strictly no claimed warranty 
‎ ‎ ﹒ read  our  [nitro](https://discord.com/channels/1132616889047187467/1214549189116166174) informations
‎ ‎ ﹒ vouch the item within 24hrs
‎ ‎ ﹒ claim within twenty minute !

 ‎  ⸝⸝  𝓃itro  𝓁inks ﹕ 30  days warr\n${sentNitros}`).then(() => {
            message.channel.send(`Successfully sent ${amount} ${type} nitro(s) to ${user.user.tag}.`);
        }).catch(() => {
            message.channel.send(`Failed to send nitro to ${user.user.tag}.`);
        });
    }
};
