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
                .addStringOption(option => option.setName('input').setDescription('Role to give permission(s)'))),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
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
                const role = interaction.guild.roles.cache.find(r => r.name === string);
                for(let permission of interaction.values){
                    role.setPermissions(permission);
                    console.log(`Permissions changed for role ${role.name}`);
                }
                
                await interaction.update({content: `You have chosen ${interaction.values.lenght} permission(s)`, components: []});
                break;
        
            default:
                break;
        }
    }
}