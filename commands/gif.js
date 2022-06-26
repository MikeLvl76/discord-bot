const { SlashCommandBuilder } = require('@discordjs/builders');
const cheerio = require("cheerio")
const fetch = require("node-fetch");
const { CommandInteraction } = require('discord.js');
const puppeteer = require('puppeteer')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Send a gif with value as argument')
        .addStringOption(option => option.setName('input').setDescription('Choose a name')),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        await interaction.reply("Please wait...");
        const string = interaction.options.getString('input');
        if (string.includes(' ')) string = string.replace(' ', '-');
        const url = `https://tenor.com/search/${string}-gifs`
        let elements = []
        await puppeteer.launch().then(async browser => {
            const page = await browser.newPage()
            await page.goto(url)
            const links = await page.evaluate(
                () => Array.from(
                  document.querySelectorAll('a[href]'),
                  a => a.getAttribute('href')
                )
            );
            elements = links.filter(a => a.includes("/view/"));
        });
        await interaction.editReply(`https://tenor.com${elements[Math.floor(Math.random()*elements.length)]}`);
    }
}