const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn an user')
        .addUserOption(option => option.setName('target').setDescription('The user'))
        .addStringOption(option => option.setName('reason').setDescription('Give the reason of the warning')),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const user = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        const reader = fs.readFileSync('./commands/warnings.json');
        const data = JSON.parse(reader);
        let index = 0;

        if (!user) {
            await interaction.reply('Sorry, unavailable user');
            throw new Error("error on user");
        }
        if (data['list'].length === 0) {
            const collect = {};
            collect[user.username] = {
                '1': reason
            };
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
        fs.writeFile('./commands/warnings.json', JSON.stringify(data, null, 4), err => {
            if (err) throw err;
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
    }
}