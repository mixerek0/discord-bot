const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("skipto").setDescription("skipuje do wybranej nutki")
    .addNumberOption((option) => 
        option.setName("tracknumber").setDescription("nutka skipnieta do").setMinValue(1).setRequired(true)),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("nie ma nutek w que 😥")

        const trackNum = interaction.options.getNumber("tracknumber")
        if (trackNum > queue.tracks.length)
            return await interaction.editReply("nie poprawna id nutki")
		queue.skipTo(trackNum - 1)

        await interaction.editReply(`skipnieta do ${trackNum}`)
	},
}
