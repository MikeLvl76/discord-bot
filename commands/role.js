const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Create or delete a role in the server')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a new role')
                .addStringOption(option => option.setName('input').setDescription('Name of the role to create')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete a role')
                .addStringOption(option => option.setName('input').setDescription('Name of the role to delete')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('View all roles in the server'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View info of role')
                .addStringOption(option => option.setName('input').setDescription('Name of the role to view'))),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const cmd = interaction.options.getSubcommand();
        const role = interaction.options.getString('input');
        const found = interaction.guild.roles.cache.find(r => r.name === role);
        switch (cmd) {
            case 'create':
                if(!interaction.member.roles.cache.some(r => r.name === 'Master')){
                    await interaction.reply("You have not the permission to do this action !");
                    throw new Error("permission denied");
                }
                if (found === undefined) {
                    await interaction.guild.roles.create({
                        data: {
                            permissions: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.SPEAK]
                        }
                    }).then(r => {
                        r.setName(role);
                        r.setColor('RANDOM');
                    });
                    await interaction.reply(`Role "${role}" created !`);
                    console.log(`${interaction.user.username} created role "${role}"`);
                } else {
                    await interaction.reply(`Role "${role}" already created !`);
                }
                break;

            case 'delete':
                if(!interaction.member.roles.cache.some(r => r.name === 'Master')){
                    await interaction.reply("You have not the permission to do this action !");
                    throw new Error("permission denied");
                }
                if (found === undefined) {
                    await interaction.reply(`Role "${role}" already deleted or never been created !`);
                } else {
                    await interaction.guild.roles.delete(found);
                    await interaction.reply(`Role "${role}" deleted !`);
                    console.log(`${interaction.user.username} deleted role "${role}"`);
                }
                break;

            case 'list':
                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Server ${interaction.guild.name}`)
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL(), url: `https://discordapp.com/users/${interaction.user.id}/` })
                    .setDescription('List of all roles of this server.')
                    .setThumbnail('https://i.imgur.com/MtxXPqa.png')
                    .addField('role(s)', interaction.guild.roles.cache.map(r => `${r}`).join(' | '), false)
                    .setImage(interaction.guild.iconURL())
                    .setFooter({ text: new Date().toLocaleString(), iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });
                console.log(`${interaction.user.username} listed all roles`);
                break;

            case 'view':
                if (found === undefined) {
                    await interaction.reply(`Role "${role}" deleted or never been created !`);
                } else {
                    const permissions = found.permissions.toArray().join('\n');
                    await interaction.reply(`Permissions for role "${role} :\n${permissions}`);
                    console.log(`${interaction.user.username} has viewed role "${role}"`);
                }

            default:
                break;
        }
    }
}