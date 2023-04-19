const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removecomponents')
        .setDescription('Minecool only command.')
        .addStringOption(option => option.setName('message').setDescription('Message ID')),
    async execute(interaction) {
        if (interaction.user.id !== '746205219238707210') return interaction.editReply('You do not have permission to run this command.');
        const messageId = interaction.options.getString('message');
        const message = await interaction.channel.messages.fetch(messageId);
        message.edit({ components: [] });
        return interaction.deleteReply()
    },
};