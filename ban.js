const { SlashCommandBuilder, IntentsBitField } = require('discord.js');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { execute } = require('../Utilities/ping');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user')
    .addUserOption(option => option.setName('user').setDescription('The member you want to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for banning this member').setRequired(true)),
    async execute(interaction, client) {
        const users = interaction.options.getUser('user');
        const ID = users.id;
        const banUser = await interaction.guild.members.fetch(ID).catch(err => null);
        if (!banUser) return interaction.reply({ content: "User not found!", ephemeral: true });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: "ou must have the ban members permission to use this command", ephemeral: true});
        if (interaction.member.id === ID) return await interaction.reply({ content: "You cannot ban yourself!", ephemeral: true});

        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No reason given";

        const dmEmbed = new EmbedBuilder()
        .setColor(0x0089D8)
        .setDescription(`:white_check_mark: ${banUser.tag} has been banned | ${reason}`)
        .setFooter({ text: 'Secury ©' });

        const embed = new EmbedBuilder()
        .setColor(0x0089D8)
        .setDescription(`:white_check_mark: ${banUser.tag} has been banned | ${reason}`)
        .setFooter({ text: 'Secury ©' });

        await interaction.guild.bans.create(banUser.id, { reason }).catch(err => {
            return interaction.reply({ content: "I cannot ban this member!", ephemeral: true });
        });

        await banUser.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        })

        await interaction.reply({ embeds: [embed] });
    }
}
