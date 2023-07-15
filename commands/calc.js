const { calcWinAmount } = require('../utils/general.js');

module.exports = {
    name: 'calc',
    description: 'Calculate the amount of money you would win if you won the bet. Usage: e!calc <amount> <HH:MM-HH:MM>, e!calc <amount> <HH:MM>',
    async execute(message, arguments) {

        const args = arguments.args;
        const UserBetsTable = arguments.userBetsTable;

        const rangeRegex = new RegExp('(1[0-2]|0?[1-9])(:([0-5][0-9]))?-(1[0-2]|0?[1-9])(:([0-5][0-9]))?');
        const potRegex = new RegExp('(1[0-2]|0?[1-9])(:([0-5][0-9]))?');

        let betAmount = 0;
        let wakeUpTime = " ";
        let potTime = " ";

        if (args.length < 3) {
            message.reply('You need to at least specify an amount and a time interval');
            return;
        }

        betAmount = parseFloat(args[1]);

        if (isNaN(betAmount) || betAmount < 0) {
            message.reply('Bet must be a valid number greater than 0');
            return;
        }

        wakeUpTime = args[2];
        potTime = args[3] ? args[3] : null;

        if (!rangeRegex.test(wakeUpTime)) {
            message.reply('that doesn\'t seem to be a valid time range');
            return;
        }

        if (potTime && !potRegex.test(potTime)) {
            message.reply('that doesn\'t seem to be a valid pot time');
            return;
        }

        let messageReply = `You would win $${calcWinAmount(betAmount, wakeUpTime)}`;
        if (potTime) {
            messageReply += ` if you won the bet and the pot time was ${potTime}`;
        }

        message.reply(messageReply);

    }
}
