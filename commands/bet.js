module.exports = {
    name: 'bet',
    description: 'Bet money on when Elias will wake up. Usage: e!bet <amount> <HH:MM-HH:MM> or e!bet <amount> <HH:MM>',
    execute(message, args) {
        if (args.length < 3) {
            message.reply('you need to specify an amount and a time');
            return;
        }

        const amount = parseFloat(args[1]);
        const time = args[2];

        if (isNaN(amount)) {
            message.reply('that doesn\'t seem to be a valid number');
            return;
        }

        if (amount <= 0) {
            message.reply('you need to bet at least 1 dollar');
            return;
        }

        const timeRegex = time.includes('-') ? new RegExp('(1[0-2]|0?[1-9]):([0-5][0-9])-(1[0-2]|0?[1-9]):([0-5][0-9])') : new RegExp('^(0?[1-9]|1[0-2]):[0-5][0-9]$');

        if (!timeRegex.test(time)) {
            message.reply('that doesn\'t seem to be a valid time');
            return;
        }

        message.reply(`you bet ${amount} dollars on Elias waking up in the ${time}`);
    }
};