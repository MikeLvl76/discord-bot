const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const { AUTHORIZATION } = require('../resources/aut.json');

let array = [];
for (let i = 0; i < Object.keys(AUTHORIZATION).length; i++) {
    array[i] = {
        name: Object.keys(AUTHORIZATION)[i],
        value: Object.values(AUTHORIZATION)[i].replace('"', '')
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('permission')
        .setDescription('Set permission(s) for role')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add permission(s) for role')
                .addStringOption(option => option.setName('name').setDescription('Role to give permission(s)'))
                .addStringOption(option => option.setName('permission').setDescription('Permission for channel')
                    .addChoices(...array)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove permission(s) for role')
                .addStringOption(option => option.setName('name').setDescription('Role to remove permission(s)'))
                .addStringOption(option => option.setName('permission').setDescription('Permission for channel')
                    .addChoices(...array))),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        if (!interaction.member.roles.cache.some(r => r.name === 'Master')) {
            await interaction.reply("You don't have the permission to do this action !");
            return;
        }

        const string = command.options.getString('name');
        const cmd = command.options.getSubcommand();
        const role = command.guild.roles.cache.find(r => r.name === string);
        const choice = interaction.options.getString('permission')

        switch (cmd) {
            case 'add':
                role.permissions.add(choice);
                console.log(`Permission added for role ${role.name}`);
                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`:white_check_mark: Permission added for role ${role.name}`)
                    .addFields([
                        { name: `:abc: name`, value: choice, inline: true },
                        { name: `:bust_in_silhouette: added by`, value: interaction.user.username, inline: true }
                    ])
                    .setImage(interaction.guild.iconURL())
                    .setFooter({ text: new Date().toLocaleString(), iconURL: interaction.user.displayAvatarURL() });;

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;

            case 'remove':
                role.permissions.remove(choice);
                const embed2 = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`:x: Permission removed for role ${role.name}`)
                    .addFields([
                        { name: `:abc: name`, value: choice, inline: true },
                        { name: `:bust_in_silhouette: removed by`, value: interaction.user.username, inline: true }
                    ])
                    .setImage(interaction.guild.iconURL())
                    .setFooter({ text: new Date().toLocaleString(), iconURL: interaction.user.displayAvatarURL() });;

                await interaction.reply({ embeds: [embed2], ephemeral: true });
                break;

            default:
                break;
        }
    }
}
