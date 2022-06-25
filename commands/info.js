const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about a user or a server !')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Info about a user')
                .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Info about the server')),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {

        const cmd = interaction.options.getSubcommand();

        switch (cmd) {
            case 'user':
                const user = interaction.options.getUser('target');
                if(!user){
                    await interaction.reply('Sorry, unavailable user');
                    break;
                }
                const dict = {
                    "id" : user.id,
                    "tag" : user.tag,
                    "username" : user.username,
                    "role" : user.role,
                    "joined at" : user.createdAt,
                }
                await interaction.reply(`Info about ${user.username} : \n${JSON.stringify(dict, Object.keys(dict), '\t')}`);
                break;

            case 'server':
                const server = interaction.guild;
                if(!server){
                    await interaction.reply('Sorry, a problem has occured with server');
                    break;
                }
                const infos = {
                    "id" : server.id,
                    "name" : server.name,
                    "created at " : server.createdAt,
                    "total members" : server.memberCount,
                    "Owner" : server.ownerId
                }
                await interaction.reply(`Info about server ${server.name} : \n${JSON.stringify(infos, Object.keys(infos), '\t')}`);
                break;

            default:
                break;
        }


        const message = await interaction.fetchReply();
        console.log(`To user ${interaction.user.username} :`);
        console.log(`\t- Received in ${message.createdTimestamp - interaction.createdTimestamp} ms`)
        console.log(`\t- Ping : ${interaction.client.ws.ping} ms`);
    }
}