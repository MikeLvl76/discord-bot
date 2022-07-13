const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('todo')
        .setDescription('Add a thing in todo list !')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a new entry')
                .addStringOption(option => option.setName('entry').setDescription('What you have to do').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove an item')
                .addIntegerOption(option => option.setName('index_deletion').setDescription('What you have done').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription('Edit an item')
                .addIntegerOption(option => option.setName('index').setDescription('Change what you have to do').setRequired(true))
                .addStringOption(option => option.setName('new').setDescription('The new thing you have to do').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Display todo list')),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const fetchUser = interaction.guild.members.cache.get(interaction.user.id);
        const nickname = fetchUser.nickname;
        const reader = fs.readFileSync('./resources/todo.json');
        const data = JSON.parse(reader);

        const cmd = interaction.options.getSubcommand();

        switch (cmd) {
            case 'add':
                const entry = interaction.options.getString('entry');
                data['list'].push(entry);
                const embed = new MessageEmbed()
                    .setColor(interaction.user.hexAccentColor)
                    .setTitle('New entry in todo list !')
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL(), url: `https://discordapp.com/users/${interaction.user.id}/` })
                    .setDescription('New entry in todo list !')
                    .setThumbnail('https://i.imgur.com/MtxXPqa.png')
                    .addField(`:memo: entry`, entry, true)
                    .setFooter({ text: new Date().toLocaleString()});
                await interaction.reply({ embeds: [embed] });
                console.log(`${interaction.user.username} has put ${entry} in todo list !`);
                break;

            case 'remove':
                const index_deletion = interaction.options.getInteger('index_deletion');
                if (data['list'][index_deletion] === undefined) {
                    await interaction.reply("Incorrect index, please retry with correct index.");
                    return;
                }
                const deleted = data['list'][index_deletion];
                data['list'].splice(index_deletion, 1);
                const embed2 = new MessageEmbed()
                    .setColor(interaction.user.hexAccentColor)
                    .setTitle('Deletion in todo list !')
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL(), url: `https://discordapp.com/users/${interaction.user.id}/` })
                    .setThumbnail('https://i.imgur.com/MtxXPqa.png')
                    .addField(`:x: deletion`, deleted, true)
                    .setFooter({ text: new Date().toLocaleString()});
                await interaction.reply({ embeds: [embed2] });
                console.log(`${interaction.user.username} has removed ${deleted} from todo list !`);
                break;

            case 'edit':
                const index = interaction.options.getInteger('index');
                const _new = interaction.options.getString('new');
                if (data['list'][index] === undefined) {
                    await interaction.reply("Incorrect index, please retry with correct index.");
                    return;
                }
                const old = data['list'][index];
                data['list'][index] = _new;
                const embed3 = new MessageEmbed()
                    .setColor(interaction.user.hexAccentColor)
                    .setTitle('Edit in todo list !')
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL(), url: `https://discordapp.com/users/${interaction.user.id}/` })
                    .setThumbnail('https://i.imgur.com/MtxXPqa.png')
                    .addField(':pencil2: edited', old, false)
                    .addField(`:pencil2: new`, _new, false)
                    .setFooter({ text: new Date().toLocaleString()});
                await interaction.reply({ embeds: [embed3] });
                console.log(`${interaction.user.username} has edited ${old} of todo list to ${_new} !`);
                break;

            case 'list':
                const items = data['list'];
                items.map(v => items.indexOf(v).toString() + v);
                const embed4 = new MessageEmbed()
                    .setColor(interaction.user.hexAccentColor)
                    .setTitle('Display todo list !')
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL(), url: `https://discordapp.com/users/${interaction.user.id}/` })
                    .setDescription('Display todo list !')
                    .setThumbnail('https://i.imgur.com/MtxXPqa.png')
                    .addField(`:memo: deletion`, items.map(i => `${i}`).join('\n') || 'No items', false)
                    .setFooter({ text: new Date().toLocaleString()});
                await interaction.reply({ embeds: [embed4] });
                console.log(`${interaction.user.username} has listed item(s) from todo list !`);
                break;

            default:
                break;
        }

        fs.writeFile('./resources/todo.json', JSON.stringify(data, null, 4), err => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Writting in file success !");
        });
    }
}