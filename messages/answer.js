async function answerBack(message, data){
    if(!message.author.bot){
        if(message.content.includes("quoi")){
            message.channel.send(`<@${message.author.id}> ${data["quoi"][Math.floor(Math.random()*data["quoi"].length)]}`);
        } else if (message.content.includes("oui")){
            message.channel.send(`<@${message.author.id}> ${data["oui"][Math.floor(Math.random()*data["oui"].length)]}`);
        }
    }
}

module.exports = answerBack;