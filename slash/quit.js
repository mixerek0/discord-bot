const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("quit").setDescription("zatrzymuje nutki w que"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("nie ma nutek w kolejce 😥")

		queue.destroy()
        await interaction.editReply("elo cioto!")
	},
}
