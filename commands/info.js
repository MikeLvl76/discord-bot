const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const { list } = require('./warnings.json');
const data = require('./identification.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about a user or a server !')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Info about a user')
                .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Info about the server')),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const cmd = interaction.options.getSubcommand();

        switch (cmd) {
            case 'user':
                const user = interaction.options.getUser('target');
                if (!user) {
                    await interaction.reply('Sorry, unavailable user');
                    break;
                }
                const fetchUser = interaction.guild.members.cache.get(user.id);
                const roles = fetchUser.roles.valueOf();
                const joined = fetchUser.joinedAt;
                const nickname = fetchUser.nickname;
                let firstname = ':x:';
                let lastname = ':x:';
                const info = Object.keys(data).find(k => k === user.username);
                if (info != undefined) {
                    firstname = data[info][0];
                    lastname = data[info][1];
                }
                let warningCount = 0;
                for (let elt of list) {
                    if (elt[user.username] !== undefined) {
                        warningCount = Object.keys(elt[user.username]).length;
                    }
                }
                const embed = new MessageEmbed()
                    .setColor(user.hexAccentColor)
                    .setTitle(`:bust_in_silhouette: ${nickname || user.username}`)
                    .setURL(`https://discordapp.com/users/${user.id}/`)
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL(), url: `https://discordapp.com/users/${interaction.user.id}/` })
                    .setDescription('Details of user here.')
                    .setThumbnail('https://i.imgur.com/MtxXPqa.png')
                    .addFields([
                        { name: ':id:', value: user.id },
                        { name: ':eyes: tag', value: user.tag, inline: true },
                        { name: ':abc: username', value: user.username, inline: true },
                        { name: ':abc: firstname', value: firstname, inline: true },
                        { name: ':abc: lastname', value: lastname, inline: true },
                        { name: ':spy: nickname', value: nickname || ':x:', inline: true },
                        { name: ':warning: warnings', value: warningCount.toString(), inline: true },
                        { name: ':passport_control: role(s)', value: roles.map(r => `${r}`).join(' | '), inline: true },
                        { name: ':clock1: joined at', value: joined.toLocaleString(), inline: true },
                    ])
                    .setImage(user.displayAvatarURL())
                    .setFooter({ text: new Date().toLocaleString(), iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });
                break;

            case 'server':
                const server = interaction.guild;
                if (!server) {
                    await interaction.reply('Sorry, a problem has occured with server');
                    break;
                }
                const guild = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`:sparkles: ${server.name} :sparkles:`)
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL(), url: `https://discordapp.com/users/${interaction.user.id}/` })
                    .setDescription('Details of server here.')
                    .setThumbnail('https://i.imgur.com/MtxXPqa.png')
                    .addFields([
                        { name: ':id:', value: server.id },
                        { name: ':abc: name', value: server.name, inline: true },
                        { name: ':clock1: created at', value: server.createdAt.toLocaleString(), inline: true },
                        { name: ':1234: number of members', value: server.memberCount.toString(), inline: true },
                        { name: ':grinning: emojis', value: server.emojis.cache.map(e => `${e}`).join(' | ') || '.', inline: true },
                        { name: ':bust_in_silhouette: owner', value: server.ownerId, inline: true },
                    ])
                    .setImage(server.iconURL())
                    .setFooter({ text: new Date().toLocaleString(), iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [guild] });
                break;

            default:
                break;
        }
    }
}