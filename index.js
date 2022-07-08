const fs = require('fs');
const cron = require('cron');
const { Client, Collection, Intents, Permissions } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const { token, answers, channelId, todo} = require('./config.json');
const handleCommand = require('./handles/command');
const answerBack = require('./messages/answer');
const special_commands = require('./messages/command');

client.commands = new Collection();

const files = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

for (const file of files) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log("Ready to interact !");
    const check = 1000 * 300; // in ms
    setInterval(() => {
        client.channels.fetch(channelId[0])
            .then(channel => channel.send(todo[Math.floor(Math.random()*todo.length)]));
        console.log(`[${client.user.username}] at [${new Date().toLocaleString()}] send a message`);
    }, check);
    const scheduledMessage = new cron.CronJob('00 00 21 * * *', () => {
        client.channels.fetch(channelId[0])
            .then(channel => channel.send(`I'M HERE`));
    });

    scheduledMessage.start()
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) handleCommand(client, interaction);
});

client.on('messageCreate', message => {
    answerBack(message, answers);
    special_commands(message);
});

client.login(token);