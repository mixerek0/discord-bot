const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("mixuje nutki 🤙"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("nie ma nutek w que 😥")

		queue.shuffle()
        await interaction.editReply(`kolejka ${queue.tracks.length} zostala wymixowana!`)
	},
}
