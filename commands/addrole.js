const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('Create a role')
        .addSubcommand(subcommand =>
            subcommand
                .setName('role')
                .setDescription('Set a new role')
                .addStringOption(option => option.setName('input').setDescription('Created role'))),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const role = interaction.options.getString('input');
        const found = interaction.guild.roles.cache.find(r => r.name === role);
        if(found === undefined){
            await interaction.guild.roles.create({
                data: {
                  permissions: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.SPEAK]
                }
            }).then(r => {
                r.setName(role);
                r.setColor('RANDOM');
            });
        } else {
            await interaction.reply(`Role "${role}" already created !`);
        }
        await interaction.reply(`Role "${role}" created !`);
    }
}