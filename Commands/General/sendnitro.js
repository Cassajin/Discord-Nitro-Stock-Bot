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

        // Send the nitros to the user
        nitrosToSend.forEach(nitro => {
            user.send(`Here is your ${type} nitro: ${nitro.Gift_Link}`).catch(() => {
                message.channel.send(`Failed to send nitro to ${user.user.tag}.`);
            });
        });

        message.channel.send(`Successfully sent ${amount} ${type} nitro(s) to ${user.user.tag}.`);
    }
};
