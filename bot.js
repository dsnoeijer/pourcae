require('dotenv').config();
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes, Collection } = require("discord.js");
const { BOT } = require('./modules/bot');

// create a collection to store our slash commands
// we use the array below to register our commands with discord
BOT.slashCommands = new Collection();
const slashCommands = [];

// read all files in the slashCommands directory that end in .js
const slashCommandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));

// loop through all files we found and 
// then push them to our array of commands

for (const slashFile of slashCommandFiles) {

    // create a new var to store our slash command
    const slashCommand = require(`./slashCommands/${slashFile}`);

    // set the command based on the name specified
    BOT.slashCommands.set(slashCommand.data.name, slashCommand);

    // push the command to our array
    slashCommands.push(slashCommand.data.toJSON())

    // for debugging purposes, make sure all commands are loaded correctly
    console.log(`${slashCommand.data.name}.js loaded.`);
}

// When the client is ready, run this code (only once)
BOT.once('ready', () => {

    // shows "BOT IS PLAYING LOREMASTER" in discord
    BOT.user.setActivity("Loremaster", { type: "PLAYING" });

    // for registering our commands with discord, we use REST
    const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

    (async () => {
        try {
            console.log('Started refreshing slash commands');

            // register commands
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: slashCommands }
            );
            
            // for debugging purposes
            console.log('Succesfully reloaded slash commands');
        } catch (e) {
            console.log('ERROR:', e);
        }
    })();

    console.log('Bot is ready!');
});

// listen for interactions (slash commands, buttons, reactions etc but not regular messages)
BOT.on("interactionCreate", async interaction => {

    // if a command was entered
    if (interaction.isCommand()) {

        // get the command that was entered
        const slashCommand = BOT.slashCommands.get(interaction.commandName);

        // return if it's not a valid slash command
        if (!slashCommand) return;

        try {

            // execute the command, we pass interaction so we can reply.
            // BOT is not neccesary but can be useful
            await slashCommand.execute(BOT, interaction);
        } catch (e) {

            // in case of error
            await interaction.followUp({ content: `Error executing command: ${e}`, ephemeral: true })
        }

    }
})

// reconnect on error
BOT.on("error", (error) => {
    console.log(error);
    reconnect();

});

// reconnect on disconnect
BOT.on("disconnect", (error) => {
    console.log(error);
    reconnect();
});

// login to Discord
BOT.login(process.env.BOT_TOKEN);