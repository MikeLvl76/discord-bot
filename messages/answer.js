const { MessageEmbed } = require('discord.js');

async function answerBack(message, data, client){
    if(!message.author.bot){
        if(message.content.includes("quoi")){
            message.channel.send(`<@${message.author.id}> ${data["quoi"][Math.floor(Math.random()*data["quoi"].length)]}`);
        } else if (message.content.includes("oui")){
            message.channel.send(`<@${message.author.id}> ${data["oui"][Math.floor(Math.random()*data["oui"].length)]}`);
        } else if (message.mentions.has(client.user)){
            const embed = new MessageEmbed()
                    .setColor(`#0099ff`)
                    .setTitle(`All available commands`)
                    .setThumbnail('https://cdn-icons-png.flaticon.com/512/138/138849.png')
                    .addFields([
                        { name: ':information_source: /info', value: 'Get info about user or server', inline: true},
                        { name: ':no_entry_sign: /permissions', value: 'Add permissions to role', inline: true},
                        { name: ':speaking_head: /ping', value: 'Call me', inline: true},
                        { name: ':busts_in_silhouette: /role', value: 'Create or delete a role', inline: true},
                        { name: ':bust_in_silhouette: /setrole', value: 'Manage user\'s role', inline: true},
                        { name: ':warning: /warn', value: 'Warn user', inline: true},
                    ])
                    .addFields([
                        { name: ':link: $wiki', value: 'Search term in Wikipedia', inline: true},
                        { name: ':white_sun_rain_cloud: $weather', value: 'Get the weather of your city', inline: true},
                        { name: ':speech_left: $translate', value: 'Translate message from language to another', inline: true},
                    ])
                    .setFooter({ text: new Date().toLocaleString()});
            message.author.send({ embeds: [embed] });
        }
    }
}

module.exports = answerBack;