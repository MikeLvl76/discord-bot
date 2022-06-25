const fs = require('fs');
const {Client, Collection, Intents} = require('discord.js');
const client = new Client({ intents : [Intents.FLAGS.GUILDS]});

const {token} = require('./config.json');
const handleCommand = require('./handles/command');
client.commands = new Collection();

const files = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

for(const file of files){
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
   console.log("Bot ready !");
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) handleCommand(client, interaction);
});

client.login(token);