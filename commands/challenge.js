const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { parse } = require('../functions/parse.js');
const { parseModifiers, parseMode, parseDifficulty, parseTowerSets } = require('../functions/parseChallenge.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('challenge')
        .setDescription('Retrieve Challenge Data')
        .addStringOption(option => option.setName('code').setDescription('Challenge Code').setRequired(true)),
    async execute(interaction) {
        let code = interaction.options.getString(`code`).toUpperCase()
        if (code.length !== 7) {
            interaction.followUp(`Invalid Code. The code must be 7 characters long. You tried to input a ${code.length} length code.`)
            return;
        }
        const response = await axios.get(`https://data.ninjakiwi.com/btd6/challenges/challenge/${code}`);
        const data = parse(response.data.body);
        const challengeEmbed = {
            title: data.name,
            url: `https://join.btd6.com/Challenge/${data.id}`,
            description: parseModifiers(data).join('\n'),
            thumbnail: {
                url: parseDifficulty(data)
            },
            author: {
                name: data.id,
                icon_url: parseMode(data)
            },
            fields: [{
                name: "Lives",
                value: `${data.lives}/${data.maxLives}`,
                inline: true
            },
            {
                name: "Cash",
                value: `$${data.startingCash.toLocaleString('en-US')}`,
                inline: true
            },
            {
                name: "Round",
                value: `${data.startRound}/${data.endRound}`,
                inline: true
            }, ...parseTowerSets(data)],
        }
        const statsEmbed = {
            title: 'Stats',
            fields: [
                {
                    name: 'Likes',
                    value: data.upvotes,
                    inline: true
                },
                {
                    name: 'Wins',
                    value: data.wins,
                    inline: false
                },
                {
                    name: 'Attempts',
                    value: 'N/A',
                    value: data.plays + data.restarts || 'NA',
                    inline: false
                },
                {
                    name: 'Fails',
                    value: data.plays + data.restarts - data.wins || 'NA',
                    inline: true
                },
                {
                    name: 'Winners',
                    value: data.winsUnique,
                    inline: true
                },
                {
                    name: 'Losers',
                    value: data.playsUnique - data.winsUnique,
                    inline: true
                },
            ],
            footer: {
                text: `Made in v${data.gameVersion}`,
            }
        }
        interaction.editReply({ embeds: [challengeEmbed, statsEmbed] })
    },
};
