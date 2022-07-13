const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('identify')
        .setDescription('Identify yourself by giving your fisrtname and lastname !')
        .addStringOption(option => option.setName('firstname').setDescription('Your firstname').setRequired(true))
        .addStringOption(option => option.setName('lastname').setDescription('Your lastname').setRequired(true)),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const firstname = interaction.options.getString('firstname');
        const lastname = interaction.options.getString('lastname');
        const fetchUser = interaction.guild.members.cache.get(interaction.user.id);
        const nickname = fetchUser.nickname;
        const reader = fs.readFileSync('../resources/identification.json');
        const data = JSON.parse(reader);

        if (Object.keys(data).length === 0) {
            data[interaction.user.username] = [firstname, lastname];
        } else {
            for (let key of Object.keys(data)) {
                if (key === interaction.user.username || key !== interaction.user.username) {
                    data[interaction.user.username] = [firstname, lastname];
                    const embed = new MessageEmbed()
                        .setColor(interaction.user.hexAccentColor)
                        .setTitle(`:bust_in_silhouette: ${nickname || interaction.user.username}`)
                        .setURL(`https://discordapp.com/users/${interaction.user.id}/`)
                        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL(), url: `https://discordapp.com/users/${interaction.user.id}/` })
                        .setDescription('Your firstname and lastname.')
                        .setThumbnail('https://i.imgur.com/MtxXPqa.png')
                        .addFields([
                            {name: `:abc: firstname`, value: `${firstname}`, inline: true},
                            {name: `:abc: lastname`, value: `${lastname}`, inline: true}
                        ])
                        .setImage(interaction.user.displayAvatarURL())
                        .setFooter({ text: new Date().toLocaleString(), iconURL: interaction.user.displayAvatarURL() });
                    await interaction.reply({ embeds: [embed] });
                    break;
                }
            }
        }
        fs.writeFile('../resources/identification.json', JSON.stringify(data, null, 4), err => {
            if (err) { 
                console.log(err);
                return;
            }
            console.log(`${interaction.user.username} has updated his personnal informations`);
        });
    }
}