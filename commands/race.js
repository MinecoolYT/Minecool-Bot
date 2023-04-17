const { SlashCommandBuilder, ChannelType, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { parse } = require('../functions/parse.js');
const { parseModifiers, parseMode, parseDifficulty, parseTowerSets } = require('../functions/parseChallenge.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('race')
        .setDescription('Retrieve Race Data'),
    async execute(interaction) {
        const response = await axios.get(`https://data.ninjakiwi.com/btd6/races`);
        const data = response.data.body;

        const selectMenu = {
            "type": 1,
            "components": [{
                "type": 3,
                "custom_id": "select",
                "placeholder": "Select a race",
                "options": data.map(race => ({
                    "label": race.name,
                    "value": race.metadata,
                    "description": new Date(race.start).toUTCString()
                }))
            }]
        }

        interaction.editReply({ components: [selectMenu] })
    },
    async selectMenu(interaction) {
        const raceSelectMenuObject = interaction.message.components[0].components[0].data.options.find(race => race.value === interaction.values[0]);
        const raceEvent = {
            url: raceSelectMenuObject.value,
            id: raceSelectMenuObject.label,
            timestamp: Date.parse(raceSelectMenuObject.description),
        }
        const race = getRace(parse((await axios.get(raceEvent.url)).data.body), raceEvent.timestamp);
        interaction.update({ embeds: [race] })
    }
};

function getRace(data, timestamp) {
    return {
        author: {
            name: `Race #${calculateEventIndex(timestamp)}`
        },
        title: data.name,
        description: parseModifiers(data).join('\n'),
        thumbnail: {
            url: "https://cdn.discordapp.com/emojis/880692063681781790.webp?size=1024&quality=lossless"
        },
        fields: [
            {
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
            },
            ...parseTowerSets(data)
        ],
    }
}

function calculateEventIndex(timestamp) {
    const firstEventTimestamp = 1544601600000;
    const timeDifference = timestamp - firstEventTimestamp;
    const weeksElapsed = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));
    return Math.round(weeksElapsed + 1); // In case event doesn't start at the expected time
}