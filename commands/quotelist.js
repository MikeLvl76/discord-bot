const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const { list } = require('../resources/quote.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quotelist')
        .setDescription('List all quotes of user')
        .addUserOption(option => option.setName('target').setDescription('User to list his quotes')),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        const fetchUser = interaction.guild.members.cache.get(user.id);
        const nickname = fetchUser.nickname;

        if (!user) {
            await interaction.reply('Sorry, unavailable user');
            throw new Error("error on user");
        }

        let quotes = []
        for(let elt of list){
            if(elt[user.username] !== undefined){
                quotes = Object.values(elt[user.username]);
            }
        }
        quotes = quotes.flat();
        const embed = new MessageEmbed()
            .setColor(user.hexAccentColor)
            .setTitle(`:bust_in_silhouette: ${nickname || user.username}`)
            .setURL(`https://discordapp.com/users/${user.id}/`)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL(), url: `https://discordapp.com/users/${interaction.user.id}/` })
            .setDescription('List of all quotes.')
            .setThumbnail('https://i.imgur.com/MtxXPqa.png')
            .addField(':scroll: quotes', quotes.map(q => `${q}`).join('\n') || 'No quotes', false)
            .setImage(user.displayAvatarURL())
            .setFooter({ text: new Date().toLocaleString(), iconURL: interaction.user.displayAvatarURL() });
        await interaction.reply({ embeds: [embed] });

    }
}