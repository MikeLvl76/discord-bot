const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn an user')
        .addSubcommand(subcommand =>
            subcommand
                .setName('options')
                .setDescription('Doable commands to add warning of view warnings')
                .addStringOption(option => option.setName('choice').setDescription('Add/view')
                    .addChoices(
                        { name: 'Add', value: 'add' },
                        { name: 'View', value: 'view' }
                    ))
                .addUserOption(option => option.setName('target').setDescription('The user'))
                .addStringOption(option => option.setName('reason').setDescription('Give the reason of the warning').setRequired(false))
        ),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        if (!interaction.member.roles.cache.some(r => r.name === 'Master')) {
            await interaction.reply("You don't have the permission to do this action !");
            return;
        }
        const user = interaction.options.getUser('target');
        const fetchUser = interaction.guild.members.cache.get(user.id);
        const nickname = fetchUser.nickname;
        const reason = interaction.options.getString('reason');
        const choice = interaction.options.getString('choice');
        const reader = fs.readFileSync('../resources/warnings.json');
        const data = JSON.parse(reader);
        let index = 0;

        if (!user) {
            await interaction.reply('Sorry, unavailable user');
            return;
        }
        switch (choice) {
            case 'add':
                if (data['list'].length === 0) {
                    const collect = {};
                    collect[user.username] = {
                        '1': reason
                    };
                    index = 1;
                    data['list'].push(collect);
                } else {
                    for (let elt of data['list']) {
                        if (elt[user.username] === undefined) {
                            elt[user.username] = {
                                '1': reason
                            };
                            break;
                        } else {
                            const keys = Object.keys(elt[user.username]);
                            const last = parseInt(keys[keys.length - 1]);
                            index = last + 1;
                            elt[user.username][index] = reason;
                            break;
                        }
                    }
                }
                fs.writeFile('../resources/warnings.json', JSON.stringify(data, null, 4), err => {
                    if (err) { 
                        console.log(err);
                        return;
                    }
                    console.log(`${user.username} have been warned by ${interaction.user.username}`);
                });
                let text = '';
                switch (index) {
                    case 1:
                        text = `${index}st`
                        break;

                    case 2:
                        text = `${index}nd`
                        break;

                    case 3:
                        text = `${index}rd`
                        break;

                    default:
                        text = `${index}th`
                        break;
                }
                await interaction.channel.send(`<@${user.id}> You've been warned ! This is your ${text} time.`);
                break;

            case 'view':
                let warnings = [];
                for (let elt of data['list']) {
                    if (elt[user.username] !== undefined) {
                        warnings = Object.values(elt[user.username]);
                        break;
                    }
                }
                const embed = new MessageEmbed()
                    .setColor(user.hexAccentColor)
                    .setTitle(`:bust_in_silhouette: ${nickname || user.username}`)
                    .setURL(`https://discordapp.com/users/${user.id}/`)
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL(), url: `https://discordapp.com/users/${interaction.user.id}/` })
                    .setDescription('List of all warnings.')
                    .setThumbnail('https://i.imgur.com/MtxXPqa.png')
                    .addField(':warning: warnings', warnings.map(w => `${w}`).join('\n') || 'No warnings', false)
                    .setImage(user.displayAvatarURL())
                    .setFooter({ text: new Date().toLocaleString(), iconURL: interaction.user.displayAvatarURL() });
                await interaction.reply({ embeds: [embed] });
                break;
        }

    }
}