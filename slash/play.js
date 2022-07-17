const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("wczytuje nutke z yt")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("song")
				.setDescription("nutka z url")
				.addStringOption((option) => option.setName("url").setDescription("url nutki").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("playlist")
				.setDescription("laduje playliste z yt")
				.addStringOption((option) => option.setName("url").setDescription("url playlisty").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("search")
				.setDescription("szukaj se z tytulu")
				.addStringOption((option) =>
					option.setName("searchterms").setDescription("nazwa nutki").setRequired(true)
				)
		),
	run: async ({ client, interaction }) => {
		if (!interaction.member.voice.channel) return interaction.editReply("musisz byc na vc zeby cos puscic idioto")

		const queue = await client.player.createQueue(interaction.guild)
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new MessageEmbed()

		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("chuja znalazlem")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** dodana do kolejeczki 😎`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `czas: ${song.duration}`})

		} else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.editReply("chuja znalazlem")
            
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} nutek z  [${playlist.title}](${playlist.url})** zostala dodana do kolejeczki 😎`)
                .setThumbnail(playlist.thumbnail.url)
		} else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply("chuja znalazlem")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** zostala dodana do kolejeczki 😎`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `czas: ${song.duration}`})
		}
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
	},
}
