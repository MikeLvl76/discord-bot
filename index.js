const {Client, Intents} = require('discord.js');
const client = new Client({ intents : [Intents.FLAGS.GUILDS]});
const json = require('./config.json');

client.once('ready', () => {
   console.log("Hi");
});

client.login(json['token']);