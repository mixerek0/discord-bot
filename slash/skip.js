const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("skip").setDescription("skipuje nutke "),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("nie ma nutek w que 🤙")

        const currentSong = queue.current

		queue.skip()
        await interaction.editReply({
            embeds: [
                new MessageEmbed().setDescription(`${currentSong.title} zostala skipnieta!`).setThumbnail(currentSong.thumbnail)
            ]
        })
	},
}
