const puppeteer = require('puppeteer');

SPECIAL_COMMANDS = ['$wiki', '$weather']
LANG = ['fr', 'en', 'de', 'it']

function wiki(message) {
    if (!message.author.bot) {
        if (message.content.startsWith(SPECIAL_COMMANDS[0])) {
            const parts = message.content.split(' ');
            const url = '';
            switch (parts[1]) {
                case 'info':
                    message.channel.send(`Use $wiki for a Wikipedia link\nFormat must be "$wiki [lang] [message]".\nLanguages available : ${LANG}`);
                    break;

                case 'fr':
                    url = "https://fr.wikipedia.org/wiki/" + parts[2];
                    break;

                case 'en':
                    url = "https://en.wikipedia.org/wiki/" + parts[2];
                    break;

                case 'de':
                    url = "https://de.wikipedia.org/wiki/" + parts[2];
                    break;

                case 'it':
                    url = "https://it.wikipedia.org/wiki/" + parts[2];
                    break;

                default:
                    break;
            }
            message.channel.send(url !== '' ? url : 'Nothing to send anymore.');
        }
    }
}

function weather(message) {
    if (!message.author.bot) {
        if (message.content.startsWith(SPECIAL_COMMANDS[1])) {
            let i = message.content.indexOf(' ');
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
                message.channel.send(`Felt temperature of ${parts[1]} today : ${temperatures[0]}°C.\nFelt temperature for next 3 days : ${temperatures.slice(1, 4)}`);
            });
        } else {
            message.channel.send("Unknown command, please retry.");
        }
    }
}

module.exports = {wiki, weather};