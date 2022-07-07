SPECIAL_COMMANDS = ['$wiki']
LANG = ['fr', 'en', 'de', 'it']

function wiki(message) {
    if(!message.author.bot){
        if (message.content.startsWith(SPECIAL_COMMANDS[0])) {
            parts = message.content.split(' ');
            url = '';
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
        } else {
            message.channel.send("Unknown command, please retry.");
        }
    }
}

module.exports = wiki;