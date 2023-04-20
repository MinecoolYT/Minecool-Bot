const { SlashCommandBuilder, ChannelType, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { parse } = require('../functions/parse.js');
const { parseModifiers, parseMode, parseDifficulty, parseTowerSets } = require('../functions/parseChallenge.js');
const axios = require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('multidaily')
        .setDescription('Minecool only command.')
        .addStringOption(option => option.setName('ids').setDescription('ids')),
    async execute(interaction) {
        if (interaction.user.id !== '746205219238707210') return interaction.editReply('You do not have permission to run this command.');
        const challengeIds = interaction.options.getString('ids');
        interaction.deleteReply();
        const sorry = {
            description: "Sorry for the wall of embeds. Challenge Editor is having issues where you cannot search for challenges by name."
        }
        const challenges = await getChallenges(challengeIds.split(';'))
        // interaction.channel.messages.fetch("1098002505465610350").then(message => {
        //     message.edit({
        //         embeds: [...challenges, sorry]
        //     });
        // })
        interaction.channel.send({ embeds: [...challenges, sorry] })
    }
};

async function getChallenges(challengeIds) {
    let challengeArray = [];
    for (i = 0; i < challengeIds.length; i++) {
        const challengeResponse = await axios.get(`https://data.ninjakiwi.com/btd6/challenges/challenge/${challengeIds[i]}`);
        const challengeData = challengeResponse.data.body;
        challengeArray.push(await getChallengeInfo(parse(challengeData)));
    }
    return challengeArray;
}

async function getChallengeInfo(data) {
    return {
        title: data.name,
        description: `${data.map} - ${data.difficulty} - ${data.mode}\n${parseModifiers(data).join('\n')}`,
        thumbnail: {
            url: parseDifficulty(data)
        },
        author: {
            name: `${parseDate(data.id.slice(-8))} Advanced Challenge`,
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
}


// funny chatgpt generated garbage because I don't want to deal with dates

function parseDate(dateString) {
    // Extract year, month, and day from the input string
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    // Create a JavaScript Date object from the extracted values
    const date = new Date(`${year}-${month}-${day}`);

    // Extract month name and day with proper suffix
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[date.getMonth()];
    const dayWithSuffix = day + (day.endsWith("1") && day !== "11" ? "st" : day.endsWith("2") && day !== "12" ? "nd" : day.endsWith("3") && day !== "13" ? "rd" : "th");

    // Return formatted date string
    return `${monthName} ${dayWithSuffix}, ${year}`;
}