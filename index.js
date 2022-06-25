const fs = require('fs');
const {Client, Collection, Intents} = require('discord.js');
const client = new Client({ intents : [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

const {token, answers} = require('./config.json');
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

client.on("messageCreate", async message => {
    if(message.content.includes("quoi")){
        message.channel.send(`<@${message.author.id}> ${answers[Math.floor(Math.random()*answers.length)]}`);
    }
});

client.login(token);