const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("wyswietla kolejke")
    .addNumberOption((option) => option.setName("page").setDescription("strony kolejeczki").setMinValue(1)),

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing){
            return await interaction.editReply("nie ma nutek w kolejece 😥")
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if (page > totalPages) 
            return await interaction.editReply(`nie ma takiej strony, sa tylko ${totalPages} strony`)
        
        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} dodana przez <@${song.requestedBy.id}>`
        }).join("\n")

        const currentSong = queue.current

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**teraz nakurwiam**\n` + 
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "nic") +
                    `\n\n**kolejka**\n${queueString}`
                    )
                    .setFooter({
                        text: `strona ${page + 1} z ${totalPages}`
                    })
                    .setThumbnail(currentSong.setThumbnail)
            ]
        })
    }
}