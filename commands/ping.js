const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns the count of pings'),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        await interaction.reply('Yes ?');

        const message = await interaction.fetchReply();
        console.log(`User ${interaction.user.username} :`);
        console.log(`\tReceived in ${message.createdTimestamp - interaction.createdTimestamp} ms`)
        console.log(`\tPing = ${interaction.client.ws.ping} ms`);

        return interaction;
    }
}