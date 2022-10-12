const { GatewayIntentBits, Client } = require("discord.js");

const BOT = new Client(
    {
        intents:
            [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
            ]
    }
);

exports.BOT = BOT;