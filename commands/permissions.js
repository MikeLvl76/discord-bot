const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { AUTHORIZATION } = require('./aut.json');

let array = [];
for (let i = 0; i < Object.keys(AUTHORIZATION).length; i++) {
    array[i] = {
        label: Object.keys(AUTHORIZATION)[i],
        description: 'No description available',
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
                .addStringOption(option => option.setName('input').setDescription('Role to give permission(s)')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove permission(s) for role')
                .addStringOption(option => option.setName('input').setDescription('Role to remove permission(s)'))),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        if (!interaction.member.roles.cache.some(r => r.name === 'Master')) {
            await interaction.reply("You have not the permission to do this action !");
            throw new Error("permission denied");
        }
        const rows = new MessageActionRow()
            .addComponents(new MessageSelectMenu()
                .setCustomId('select-permissions')
                .setPlaceholder('Select a permission to add to role')
                .setMinValues(1)
                .setMaxValues(array.length)
                .addOptions([...array]));

        await interaction.reply({ content: 'Select the permission to add ', ephemeral: true, components: [rows] });
        switch (interaction.customId) {
            case 'select-permissions':
                const string = interaction.options.getString('input');
                const cmd = interaction.options.getSubcommand();
                const role = interaction.guild.roles.cache.find(r => r.name === string);
                switch (cmd) {
                    case 'add':
                        for (let permission of interaction.values) {
                            role.permissions.add(permission);
                            console.log(`Permissions changed for role ${role.name}`);
                        }
                        break;

                    case 'remove':
                        for (let permission of interaction.values) {
                            role.permissions.remove(permission);
                            console.log(`Permissions removed for role ${role.name}`);
                        }
                        break;

                    default:
                        break;
                }

                await interaction.update({ content: `You have chosen ${interaction.values.lenght} permission(s)`, components: [] });
                break;

            default:
                break;
        }
    }
}