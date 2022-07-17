const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("pause").setDescription("stopuje nutke"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("nie ma nutek w kolejce 😥")

		queue.setPaused(true)
        await interaction.editReply("nutka zastopowana uzyj /resume zeby wznwoic")
	},
}
