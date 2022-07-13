const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const { AUTHORIZATION } = require('../resources/aut.json');

let array = [];
for (let i = 0; i < Object.keys(AUTHORIZATION).length; i++) {
    array[i] = {
        name: Object.keys(AUTHORIZATION)[i],
        value: Object.keys(AUTHORIZATION)[i].toUpperCase()
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('add or remove channel')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add channel')
                .addStringOption(option => option.setName('name').setDescription('Channel\'s name'))
                .addStringOption(option => option.setName('permission').setDescription('Permission for channel')
                    .addChoices(...array)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove channel')
                .addStringOption(option => option.setName('name').setDescription('Channel\'s name'))),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        if (!interaction.member.roles.cache.some(r => r.name === 'Master')) {
            await interaction.reply("You don't have the permission to do this action !");
            return;
        }


        const name = interaction.options.getString('name');
        const choice = interaction.options.getString('permission')
        const subcmd = interaction.options.getSubcommand();

        switch (subcmd) {
            case 'add':

                interaction.guild.channels.create(name, {
                    type: 'GUILD_TEXT',
                    permissionOverwrites: [{
                        id: interaction.guild.id,
                        allow: [choice]
                    }]
                })
                console.log(`Channel ${name} created !`);
                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`:white_check_mark: Channel ${name}`)
                    .addFields([
                        { name: ':question: type', value: 'text', inline: true },
                        { name: `:abc: name`, value: name, inline: true },
                        { name: `:bust_in_silhouette: created by`, value: interaction.user.username, inline: true }
                    ])
                    .setImage(interaction.guild.iconURL())
                    .setFooter({ text: new Date().toLocaleString(), iconURL: interaction.user.displayAvatarURL() });;

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;

            case 'remove':
                const channel = interaction.guild.channels.cache.find(c => c.name === name);
                channel.delete();
                console.log(`Channel ${name} deleted !`);
                const embed2 = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`:x: Channel ${name}`)
                    .addFields([
                        { name: ':question: type', value: 'text', inline: true },
                        { name: `:abc: name`, value: name, inline: true },
                        { name: `:bust_in_silhouette: deleted by`, value: interaction.user.username, inline: true }
                    ])
                    .setImage(interaction.guild.iconURL())
                    .setFooter({ text: new Date().toLocaleString(), iconURL: interaction.user.displayAvatarURL() });;

                await interaction.reply({ embeds: [embed2], ephemeral: true });
                break;

            default:
                break;
        }
    }
}