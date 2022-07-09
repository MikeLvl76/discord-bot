const puppeteer = require('puppeteer');
const translate = require('@vitalets/google-translate-api');
const weather = require('weather-js');
const { MessageEmbed } = require('discord.js');

COMMANDS = ['$wiki', '$weather', '$translate', '$commandlist']

function special_commands(message) {
    if (!message.author.bot) {
        if (message.content.startsWith(COMMANDS[0])) {
            const parts = message.content.split(' ');
            if(parts.length > 3){
                parts[2] = parts.slice(2, parts.length).join("-");
            }
            if(parts[1] === 'info'){
                message.channel.send(`Use $wiki for a Wikipedia link\nFormat must be "$wiki [lang] [message]".\n`);
            } else {
                message.reply(`https://${parts[1]}.wikipedia.org/wiki/${parts[2]}`);
            }
            
        }
        else if (message.content.startsWith(COMMANDS[1])) {
            const i = message.content.indexOf(' ');
            let parts = [message.content.slice(0, i), message.content.slice(i + 1)]; // split only once by space character
            if (parts[1] === 'info') {
                message.channel.send("Use $weather to see what's forecasted for your city.\nFormat must be $weather [city].\n");
            }
            weather.find({search: parts[1], degreeType: 'C'}, function(err, json) {
                if(err) console.log(err);
                let current = undefined;
                for(let elt of json){
                    if(elt['current'] !== undefined) current = elt['current']
                }
                const embed = new MessageEmbed()
                    .setColor(`#0099ff`)
                    .setTitle(`Weather in ${current['observationpoint']}`)
                    .setThumbnail('https://cdn-icons-png.flaticon.com/512/3127/3127236.png')
                    .addFields([
                        { name: ':white_sun_rain_cloud: sky', value: `${current['skytext']}`, inline: true },
                        { name: ':thermometer: temperature', value: `${current['temperature']}°C`, inline: true },
                        { name: ':person_shrugging: feels', value: `${current['feelslike']}°C`, inline: true },
                        { name: ':droplet: humidity', value: `${current['humidity']}%`, inline: true },
                        { name: ':wind_blowing_face: wind speed', value: `${current['windspeed']}`, inline: true },
                        { name: ':clock1: time', value: `${current['observationtime']}`, inline: true },
                    ])
                    .setFooter({ text: `At ${current['date']}, ${current['day']}` });
                message.reply({ embeds: [embed] });
            });
        }
        else if (message.content.startsWith(COMMANDS[2])) {
            const parts = message.content.split(' ');
            if (parts[1] === 'info') {
                message.channel.send("Use $translate for a translation from given language to another.Format must be $translate [origin] [dest] [message].\n");
            }
            if(parts.length > 4){
                parts[3] = parts.slice(3, parts.length).join(" ");
            }
            translate(parts[3], { from: parts[1], to: parts[2] }).then(res => {
                message.reply(`${res.text}`);
            }).catch(err => {
                console.error(err);
            });
        } else if (message.content.startsWith(COMMANDS[3])) {
            const desc = `There are ${COMMANDS.length - 1} command(s) available :\n`;
            const cmd1 = `\t- use ${COMMANDS[0]} for a Wikipedia link.\n`
            const cmd2 = `\t- use ${COMMANDS[1]} to see the temperature felt in your city.\n`
            const cmd3 = `\t- use ${COMMANDS[2]} for a translation.\n`
            message.reply(desc + cmd1 + cmd2 + cmd3);
        }
    }
}

module.exports = special_commands;