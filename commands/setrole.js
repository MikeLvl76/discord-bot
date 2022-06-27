const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setrole')
        .setDescription('Set role for user')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set an existing role for user')
                .addUserOption(option => option.setName('target').setDescription('The user to give a role'))
                .addStringOption(option => option.setName('input').setDescription('Role given to user')))
        .addSubcommand(subcommand => 
            subcommand
                .setName('remove')
                .setDescription('Remove an existing role from user')
                .addUserOption(option => option.setName('target').setDescription('The user to remove a role'))
                .addStringOption(option => option.setName('input').setDescription('Role removed from user'))),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const cmd = interaction.options.getSubcommand();
        const role = interaction.options.getString('input');
        const found = interaction.guild.roles.cache.find(r => r.name === role);
        
        if(found === undefined){
            await interaction.reply(`No role named ${role}`);
        }
        const user = interaction.options.getUser('target');
        if(!user){
            await interaction.reply('Sorry, unavailable user');
        }
        const target = interaction.guild.members.cache.get(user.id);
        switch (cmd) {
            case 'set':
                target.roles.add(found);
                await interaction.reply(`Role "${role}" set for user ${user.username}`);
                break;

            case 'remove':
                target.roles.remove(found);
                await interaction.reply(`Role "${role}" remove from user ${user.username}`);
                break;
        
            default:
                break;
        }

        console.log(`${interaction.user.username} set or deleted a role`);
        console.log(`${user.username} has been affected by this changement`);
    }
}