const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');

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
                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`User ${user.username}`)
                    .setURL(`https://discordapp.com/users/${user.id}/`)
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL(), url: `https://discordapp.com/users/${interaction.user.id}/` })
                    .setDescription('Details of user here.')
                    .setThumbnail('https://i.imgur.com/MtxXPqa.png')
                    .addFields([
                        { name: 'id', value: user.id },
                        { name: 'tag', value: user.tag, inline: true },
                        { name: 'username', value: user.username, inline: true },
                        { name: 'role(s)', value: roles.map(r => `${r}`).join(' | '), inline: true },
                        { name: 'joined at', value: joined.toLocaleString(), inline: true },
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
                const infos = {
                    "id": server.id,
                    "name": server.name,
                    "created at ": server.createdAt,
                    "total members": server.memberCount,
                    "Owner": server.ownerId
                }
                const guild = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Server ${server.name}`)
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL(), url: `https://discordapp.com/users/${interaction.user.id}/` })
                    .setDescription('Details of server here.')
                    .setThumbnail('https://i.imgur.com/MtxXPqa.png')
                    .addFields([
                        { name: 'id', value: server.id },
                        { name: 'name', value: server.name, inline: true },
                        { name: 'created at', value: server.createdAt.toLocaleString(), inline: true },
                        { name: 'number of members', value: server.memberCount.toString(), inline: true },
                        { name: 'owner', value: server.ownerId, inline: true },
                    ])
                    .setImage(server.iconURL)
                    .setFooter({ text: new Date().toLocaleString(), iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [guild] });
                break;

            default:
                break;
        }
    }
}