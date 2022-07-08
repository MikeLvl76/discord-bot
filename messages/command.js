const puppeteer = require('puppeteer');

COMMANDS = ['$wiki', '$weather']
LANG = ['fr', 'en', 'de', 'it', 'es', 'pt']

function special_commands(message) {
    if (!message.author.bot) {
        if (message.content.startsWith(COMMANDS[0])) {
            const parts = message.content.split(' ');
            let url = '';
            switch (parts[1]) {

                case 'info':
                    message.channel.send(`Use $wiki for a Wikipedia link\nFormat must be "$wiki [lang] [message]".\nLanguages available : ${LANG}`);
                    break;

                case 'fr':
                    url = `https://fr.wikipedia.org/wiki/${parts[2]}`;
                    break;

                case 'en':
                    url = `https://en.wikipedia.org/wiki/${parts[2]}`;
                    break;

                case 'de':
                    url = `https://de.wikipedia.org/wiki/${parts[2]}`;
                    break;

                case 'it':
                    url = `https://it.wikipedia.org/wiki/${parts[2]}`;
                    break;

                case 'es':
                    url = `https://es.wikipedia.org/wiki/${parts[2]}`;
                    break;

                case 'pt':
                    url = `https://pt.wikipedia.org/wiki/${parts[2]}`;
                    break;

                default:
                    break;
            }
            message.channel.send(url !== '' ? url : 'Nothing to send anymore.');
        }
        else if (message.content.startsWith(COMMANDS[1])) {
            const i = message.content.indexOf(' ');
            let parts = [message.content.slice(0, i), message.content.slice(i + 1)]; // split only once by space character
            if (parts[1] === 'info') {
                message.channel.send("Use $weather to see what's forecasted for your city.\nFormat must be $weather [city].\n");
            } else {
                while (parts[1].includes(' ')) {
                    parts[1] = parts[1].replace(' ', '-');
                }
            }
            const url = `https://fr.weather-forecast.com/locations/${parts[1]}/forecasts/latest`;
            puppeteer.launch().then(async browser => {
                const page = await browser.newPage()
                await page.goto(url)
                const temperatures = await page.evaluate(
                    () => Array.from(
                        document.querySelectorAll('td[class="b-forecast__table-cell-chill b-forecast__table-day-end"]'),
                        elt => elt.textContent
                    )
                );
                let format = [];
                for(let i = 0; i < 6; i++){
                    format.push(temperatures[i] + '°C');
                }
                message.channel.send(
                    `Felt temperature of ${parts[1]} today : ${format[0]}.\nFelt temperature for next 5 days : ${format.slice(1, 6)}`
                );
            });
        } else {
            message.channel.send("Unknown command, please retry.");
        }
    }
}

module.exports = special_commands;