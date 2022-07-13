const fs = require('fs');
const cron = require('cron');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

const { token, channelId } = require('./resources/config.json');
const { answers, quote } = require('./resources/fun.json');
const { list } = require('./resources/todo.json');
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
    client.user.setActivity({ type: "PLAYING", name: `Backrooms` });
    const current = client.channels.fetch(channelId[0]);
    current.then(channel => channel.send(`It's ${new Date().toLocaleString()} and the BOAT is here.`))
    console.log("The bot has logged in !");
    const check = 1000 * 60 * 30; // in ms
    setInterval(() => {
        current.then(channel => channel.send(list[Math.floor(Math.random() * list.length)]));
    }, check);
    const scheduledMessage = new cron.CronJob('00 00 21 * * *', () => {
        current.send('Resetting...')
            .then(msg => client.destroy())
            .then(() => client.login(token));
    });

    scheduledMessage.start()
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) handleCommand(client, interaction);
});

client.on('messageCreate', message => {
    answerBack(message, answers, client);
    special_commands(message);
});

client.on('messageReactionAdd', async (reaction, user) => {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }

    if (reaction.emoji.name === quote) {

        const reader = fs.readFileSync('./resources/quote.json');
        const data = JSON.parse(reader);
        const name = user.username;
        const content = reaction.message.content;

        if (data['list'].length === 0) {
            const collect = {};
            collect[reaction.message.author.username] = {};
            collect[reaction.message.author.username][`quoted by ${name}`] = [content];
            data['list'].push(collect);
        } else {
            for (let elt of data['list']) {
                if (elt[reaction.message.author.username] === undefined) {
                    elt[reaction.message.author.username] = {};
                    elt[reaction.message.author.username][`quoted by ${name}`] = [content];
                    break;
                } else {
                    elt[reaction.message.author.username][`quoted by ${name}`].push(content);
                    break;
                }
            }
        }
        fs.writeFile('./resources/quote.json', JSON.stringify(data, null, 4), err => {
            if (err) throw err;
            console.log(`${name} has quoted ${reaction.message.author.username}'s message !`);
        });

        const embed = new MessageEmbed()
            .setColor(user.hexAccentColor)
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL(), url: `https://discordapp.com/users/${user.id}/` })
            .setDescription(':information_source: A message has been quoted by you !')
            .setThumbnail('https://i.imgur.com/MtxXPqa.png')
            .addField(`:bust_in_silhouette: user`, `${reaction.message.author.username}`, false)
            .addField(`:speech_left: message`, `${reaction.message.content}`, false)
            .setImage(reaction.message.author.displayAvatarURL())
            .setFooter({ text: new Date().toLocaleString(), iconURL: user.displayAvatarURL() });
        await reaction.message.reply({ embeds: [embed] });
    }

    // Now the message has been cached and is fully available
    console.log(`${reaction.message.author.username}'s message "${reaction.message.content}" gained a reaction!`);
    // The reaction is now also fully available and the properties will be reflected accurately:
    console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});

client.login(token);