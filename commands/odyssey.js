const { SlashCommandBuilder, ChannelType, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { parse, parseTowers } = require('../functions/parse.js');
const { parseModifiers, parseMode, parseDifficulty, parseTowerSets } = require('../functions/parseChallenge.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('odyssey')
        .setDescription('Retrieve Odyssey Data'),
    async execute(interaction) {
        const response = await axios.get(`https://data.ninjakiwi.com/btd6/odyssey`);
        const data = response.data.body;

        const selectMenu = {
            "type": 1,
            "components": [{
                "type": 3,
                "custom_id": "select",
                "placeholder": "Select an odyssey",
                "options": data.map(odyssey => ({
                    "label": odyssey.name,
                    "value": odyssey.metadata_easy.replace('easy', ''),
                    "description": new Date(odyssey.start).toUTCString()
                }))
            }]
        }

        interaction.editReply({ components: [selectMenu] })
    },
    async selectMenu(interaction) {
        const odysseySelectMenuObject = interaction.message.components[0].components[0].data.options.find(race => race.value === interaction.values[0]);
        const odysseyEvent = {
            url: odysseySelectMenuObject.value,
            id: odysseySelectMenuObject.label,
            timestamp: Date.parse(odysseySelectMenuObject.description),
        }
        const info = { title: odysseyEvent.id, description: `Week #${calculateEventIndex(odysseyEvent.timestamp)}` };
        const [easy, medium, hard] = await Promise.all([
            getOdyssey(odysseyEvent.url, 'Easy'),
            getOdyssey(odysseyEvent.url, 'Medium'),
            getOdyssey(odysseyEvent.url, 'Hard'),
        ]);
        interaction.update({ embeds: [info, easy, medium, hard] })
    }
};

async function getOdyssey(url, difficulty) {
    const [dataResponse, mapDataResponse] = await Promise.all([
        axios.get(url + difficulty.toLowerCase()),
        axios.get(url + difficulty.toLowerCase() + '/maps'),
    ]);
    const data = dataResponse.data.body;
    const mapData = mapDataResponse.data.body;
    const towers = parseTowerSets(parseTowers(data)).map(tower => ({
        name: tower.name,
        value: tower.value.split(', ').join('\n'),
        inline: true
    }));
    const maps = mapData.map(map => ({
        name: `${map.name.replace('Odyssey Map ', '')}. ${map.map.replace(/([A-Z])/g, ' $1').trim()} (${map.difficulty}, ${map.mode})`,
        value: `$${map.startingCash}, r${map.startRound}/${map.endRound}\n${parseModifiers(map).join(', ')}`
    }))
    const difficultyIcon = difficulty === 'Easy' ? 'https://i.gyazo.com/33f0604a91d9e33fd133536064adb70d.png' : difficulty === 'Medium' ? 'https://i.gyazo.com/aaa300f1f2b8f91bee268b1ce861b21f.png' : 'https://i.gyazo.com/368de4ca95785aad1d41afe87ab1a762.png';
    return {
        author: {
            name: `[${data.isExtreme ? `${difficulty}, Extreme` : difficulty}] Max ${data.maxMonkeySeats} seats and ${data.maxMonkeysOnBoat} towers. ${data.startingHealth} lives.`,
        },
        thumbnail: {
            url: difficultyIcon
        },
        fields: [
            ...towers,
            ...maps
        ],
        footer: {
            text: parseRewards(data._rewards), iconURL: 'https://i.gyazo.com/96cd2fde309677cafb438b405a84521b.png'
        }
    };
}

function parseRewards(rewards) {
    let reward = rewards.filter(reward => reward.includes("Power") || reward.includes("InstaMonkey") || reward.includes("CollectionEvent"))[0].split(':');
    if (reward[0] == 'Power') return reward[1].replace(/([A-Z])/g, " $1");
    if (reward[0] == 'InstaMonkey') return reward[1].split(',').map((s, i) => i === 0 ? s.replace(/([A-Z])/g, ' $1').trim().split(' ').join(' ') : s.padStart(3, '0')).reverse().join(' ');
    if (reward[0] == 'CollectionEvent') return `${reward[1]} Totems`
}

function calculateEventIndex(timestamp) {
    const firstEventTimestamp = 1594281600000;
    const timeDifference = timestamp - firstEventTimestamp;
    const weeksElapsed = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));
    return Math.round(weeksElapsed + 1); // In case event doesn't start at the expected time
}
