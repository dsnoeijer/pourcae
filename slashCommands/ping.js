// required to build a slash command
const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns a Pong!'),
    async execute(BOT, interaction) {

        // reply to the slash command (interaction)
        interaction.reply('Pong!');
    }
}