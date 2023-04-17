const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Get information about the bot'),
    async execute(interaction) {
        const info = {
            description: `
            Made in JavaScript by Minecool#8208
            [Support Server](https://discord.gg/hzsbSDNUf2)
            [Using Ninjakiwi's Official API](https://data.ninjakiwi.com/)
            [Open Source!](https://github.com/MinecoolYT/Minecool-Bot/)
            Hosted on personal laptop 😅
            `
        };
        return interaction.editReply({ embeds: [info] });
    },
};