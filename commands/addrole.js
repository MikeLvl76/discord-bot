const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

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
        await target.guild.roles.create({
            data: {
              name: role,
              color: '#ff0000',
              permissions: {
                  SEND_MESSAGES: true,
                  ADD_REACTIONS: true,
                  SPEAK: true
              }
            },
            reason: 'test',
          })
        interaction.guild.members.cache.forEach(r => console.log(r));
        /*console.log(target.roles);
        target.roles.add(newRole);*/
        await interaction.reply(`Role "${role}" added to ${user.username} !`);
    }
}