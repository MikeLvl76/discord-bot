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
        await interaction.reply('feur');

        const message = await interaction.fetchReply();
        console.log(`Received in ${message.createdTimestamp - interaction.createdTimestamp} ms.\nPing = ${interaction.client.ws.ping} ms.`);

        return interaction;
    }
}