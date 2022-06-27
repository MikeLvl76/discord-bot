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
        if(!interaction.member.roles.cache.some(r => r.name === 'Master')){
            await interaction.reply("You have not the permission to do this action !");
            throw new Error("permission denied");
        }
        if(found === undefined){
            await interaction.reply(`No role named ${role}`);
            throw new Error("role must be defined");
        }
        const user = interaction.options.getUser('target');
        if(!user){
            await interaction.reply('Sorry, unavailable user');
            throw new Error("user must be defined");
        }
        const target = interaction.guild.members.cache.get(user.id);
        switch (cmd) {
            case 'set':
                target.roles.add(found);
                await interaction.reply(`Role "${role}" set for user ${user.username}`);
                console.log(`${interaction.user.username} set a role`);
                break;

            case 'remove':
                if(target.roles.cache.some(r => r.name === role)){
                    target.roles.remove(found);
                    await interaction.reply(`Role "${role}" removed from user ${user.username}`);
                    console.log(`${interaction.user.username} removed a role`);
                    break;
                }
                await interaction.reply(`User ${user.username} doesn't have the role`);
                break;

            default:
                break;
        }

        console.log(`${user.username} has been affected by this change`);
    }
}