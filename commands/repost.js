const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repost')
        .setDescription('Minecool only command.')
        .addStringOption(option => option.setName('link').setDescription('Message Link').setRequired(true))
        .addStringOption(option => option.setName('replacedlink').setDescription('Message Link')),
    async execute(interaction) {
        if (interaction.user.id !== '746205219238707210') return interaction.editReply('You do not have permission to run this command.');
        interaction.deleteReply();
        const messageLink = interaction.options.getString('link').split('/');
        const channelId = messageLink.at(-2);
        const messageId = messageLink.at(-1);
        const channel = await interaction.client.channels.cache.get(channelId);
        const message = await channel.messages.fetch(messageId);
        const replacedMessageLink = interaction.options.getString('replacedlink').split('/') || null;
        if (replacedMessageLink === null) return interaction.channel.send({ embeds: message.embeds });
        const replacedChannelId = replacedMessageLink.at(-2);
        const replacedMessageId = replacedMessageLink.at(-1);
        const replacedChannel = await interaction.client.channels.cache.get(replacedChannelId);
        const replacedMessage = await replacedChannel.messages.fetch(replacedMessageId);
        return replacedMessage.edit({ embeds: message.embeds })
    },
};  