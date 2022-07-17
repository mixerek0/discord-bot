const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("resume").setDescription("wznawia nutke 🤙"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("nie ma nutek w que 😥")

		queue.setPaused(false)
        await interaction.editReply("nutka leci dalej, /pause jak chcesz zastopowac 🤙")
	},
}
