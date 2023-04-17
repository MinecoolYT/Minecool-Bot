const { SlashCommandBuilder, ChannelType, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { parse } = require('../functions/parse.js');
const { parseModifiers, parseMode, parseDifficulty, parseTowerSets } = require('../functions/parseChallenge.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Retrieve Daily Challenge Data'),
    async execute(interaction) {
        const response = await axios.get(`https://data.ninjakiwi.com/btd6/challenges/filter/daily`);
        const data = response.data.body;

        const selectMenu = {
            "type": 1,
            "components": [{
                "type": 3,
                "custom_id": "select",
                "placeholder": "Select a daily challenge",
                "options": data.map(daily => ({
                    "label": daily.name,
                    "value": daily.metadata,
                    "description": new Date(`${daily.metadata.slice(-8, -4)}-${daily.metadata.slice(-4, -2)}-${daily.metadata.slice(-2)}`).toUTCString()
                }))
            }]
        }

        interaction.editReply({ components: [selectMenu] })
    },
    async selectMenu(interaction) {
        const dailyChallengesSelectMenuObject = interaction.message.components[0].components[0].data.options.find(race => race.value === interaction.values[0]);
        const dailyChallenges = {
            url: dailyChallengesSelectMenuObject.value,
            id: dailyChallengesSelectMenuObject.label,
            timestamp: dailyChallengesSelectMenuObject.description,
        }
        const response = await axios.get(dailyChallenges.url);
        const data = parse(response.data.body);
        const challengeEmbed = {
            title: data.name,
            description: parseModifiers(data).join('\n'),
            thumbnail: {
                url: parseDifficulty(data)
            },
            author: {
                name: dailyChallenges.timestamp,
                icon_url: parseMode(data)
            },
            fields: [{
                name: "Lives",
                value: `${data.lives}/${data.maxLives}`,
                inline: true
            },
            {
                name: "Cash",
                value: `$${data.startingCash}`,
                inline: true
            },
            {
                name: "Round",
                value: `${data.startRound}/${data.endRound}`,
                inline: true
            }, ...parseTowerSets(data)],
        }
        interaction.update({ embeds: [challengeEmbed] })
    }
};