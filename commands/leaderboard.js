module.exports = {
    name: 'leaderboard',
    description: 'Displays the leaderboard',
    async execute(message, arguments) {
        const UserBetsTable = arguments.userBetsTable;
        const Discord = arguments.discord;
        const client = arguments.client;

        const leaderboardEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Leaderboard')
            .setAuthor('Elias', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
            .setDescription('The leaderboard for Elias')
            .setThumbnail('https://i.imgur.com/wSTFkRM.png')
            .setTimestamp();

        const leaderboard = await UserBetsTable.findAll({
            order: [
                ['money', 'DESC']
            ],
            limit: 10
        });

        leaderboard.forEach((user, index) => {
            const userObj = client.users.cache.get(user.user_id);
            leaderboardEmbed.addField(`${index + 1}. ${userObj.username}`, `$${user.money}`);
        });

        message.channel.send(leaderboardEmbed);
    }
}