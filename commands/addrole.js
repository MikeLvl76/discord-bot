const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('Give a role for user')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user-and-role')
                .setDescription('Set a new role for an user')
                .addUserOption(option => option.setName('target').setDescription('The user to give a role'))
                .addStringOption(option => option.setName('input').setDescription('Role given to user'))),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        const role = interaction.options.getString('input');
        const target = interaction.guild.members.cache.get(user.id);
        const found = interaction.guild.roles.cache.find(r => r.name === role);
        if(found === undefined){
            await interaction.guild.roles.create({
                data: {
                  permissions: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.SPEAK]
                }
            }).then(r => {
                r.setName(role);
                r.setColor('RANDOM');
                target.roles.add(r);
            });
        } else {
            interaction.guild.members.cache.forEach(r => console.log(r.user.username));
            target.roles.add(found);
        }
        await interaction.reply(`Role "${role}" added to ${user.username} !`);
    }
}