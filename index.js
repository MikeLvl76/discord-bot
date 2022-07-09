const fs = require('fs');
const cron = require('cron');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const { token, answers, channelId, todo, greetings} = require('./config.json');
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
    const current = client.channels.fetch(channelId[0]);
    current.then(channel => channel.send(greetings[Math.floor(Math.random()*greetings.length)]))
    console.log("The bot has logged in !");
    const check = 1000 * 300; // in ms
    setInterval(() => {
        current.then(channel => channel.send(todo[Math.floor(Math.random()*todo.length)]));
        console.log(`[${client.user.username}] at [${new Date().toLocaleString()}] send a message`);
    }, check);
    const scheduledMessage = new cron.CronJob('00 00 21 * * *', () => {
        current.then(channel => channel.send(`I'M HERE`));
    });

    scheduledMessage.start()
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) handleCommand(client, interaction);
});

client.on('messageCreate', message => {
    //if (message.mentions.has(client.user)) console.log('test')
    answerBack(message, answers);
    special_commands(message);
});

client.login(token);