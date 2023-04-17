const { SlashCommandBuilder, ChannelType, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { parse } = require('../functions/parse.js');
const { parseModifiers, parseMode, parseDifficulty, parseTowerSets } = require('../functions/parseChallenge.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boss')
        .setDescription('Retrieve Boss Data'),
    async execute(interaction) {
        const response = await axios.get(`https://data.ninjakiwi.com/btd6/bosses`);
        const data = response.data.body;

        const selectMenu = {
            "type": 1,
            "components": [{
                "type": 3,
                "custom_id": "select",
                "placeholder": "Select a boss",
                "options": data.map(boss => ({
                    "label": boss.name,
                    "value": boss.metadataStandard.replace('/standard', ''),
                    "description": new Date(boss.start).toUTCString()
                }))
            }]
        }

        interaction.editReply({ components: [selectMenu] })
    },
    async selectMenu(interaction) {
        const bossUrl = interaction.values[0];
        const normalBoss = getBoss(parse((await axios.get(`${bossUrl}/standard`)).data.body), 'normal');
        const eliteBoss = getBoss(parse((await axios.get(`${bossUrl}/elite`)).data.body), 'elite');
        interaction.update({ embeds: [normalBoss, eliteBoss] })
    }
};

function getBoss(data, type) {
    return {
        title: (type === 'normal' ? 'Normal ' : 'Elite ') + data.name.replace(/(\D+)(\d+)/, '$1 #$2'),
        description: parseModifiers(data, defaultRoundSetLength = 2).join('\n'),
        thumbnail: {
            url: type === 'normal' ? getBossThumbnail(data) : getEliteBossThumbnail(data)
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

function getBossThumbnail(boss) {
    if (boss.name.includes('Bloonarius')) return 'https://i.gyazo.com/be511c1e97575bd2c50943be77783a95.png'
    if (boss.name.includes('Lych')) return 'https://i.gyazo.com/eee6e911abfebde7aa2b4935f01e741a.png'
    if (boss.name.includes('Vortex')) return 'https://i.gyazo.com/d223e91b628adf7cb63cc42be7728180.png'
    if (boss.name.includes('Dreadbloon')) return 'https://static.wikia.nocookie.net/b__/images/6/63/DreadbloonPortrait.png/revision/latest?cb=20221207232857&path-prefix=bloons'
}
function getEliteBossThumbnail(boss) {
    if (boss.name.includes('Bloonarius')) return 'https://i.gyazo.com/5afc7acdcdd88d27aa8ef28ce074628d.png'
    if (boss.name.includes('Lych')) return 'https://i.gyazo.com/aabc3779adc0ef64f759a1eb216c7dac.png'
    if (boss.name.includes('Vortex')) return 'https://i.gyazo.com/88b3690036eccd70202cd4ba285120c9.png'
    if (boss.name.includes('Dreadbloon')) return 'https://static.wikia.nocookie.net/b__/images/f/f7/DreadbloonPortraitElite.png/revision/latest/scale-to-width-down/1000?cb=20221207235238&path-prefix=bloons'
}