const { calcWinAmount } = require('../utils/general.js');

module.exports = {
  name: 'bet',
  description: 'Bet money on when Elias will wake up. Usage: e!bet <amount> <HH:MM-HH:MM>, e!bet <amount> <HH:MM>',
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

    let messageReply = `You bet $${betAmount} on Elias waking up around ${wakeUpTime}`;

    if (potTime) {
      messageReply += ` and the pot time is ${potTime}`;
    }

    messageReply += '.\nIs this correct? (y/n)';
    message.reply(messageReply);

    const collectionFilter = (response) => {
      return response.author.id === message.author.id && ['y', 'n'].includes(response.content.toLowerCase());
    };

    try {
      // Wait for a response
      const collected = await message.channel.awaitMessages({
        filter: collectionFilter,
        max: 1,
        time: 15000, // Time in milliseconds to wait for a response (e.g., 15 seconds)
        errors: ['time'],
      });
      const response = collected.first().content.toLowerCase();
      if (response === 'y') {
        // User confirmed with 'y'
        updateUserBets(message, betAmount, wakeUpTime, potTime, UserBetsTable);

        message.reply('Confirmed!');
      } else {
        // User responded with 'n' or other
        message.reply('Cancelled!');
        return;
      }
    } catch (err) {
      console.error(err);
      message.reply('There was an error trying to execute that command!');
    }

  }
};

async function updateUserBets(message, amount, time, pTime, UserBetsTable) {
  console.log("made it in here too")
  const userRow = await UserBetsTable.findOne({ where: { id: message.author.id } });
  const winnings = calcWinAmount(amount, time);
  if (userRow) {
    userRow.update({ hasBetToday: true, currentBet: parseFloat(amount), wakeUpTime: time, potTime: pTime, estimatedWinnings: winnings });

    await userRow.save();

    console.log(`Updated user ${message.author.id} ${message.author.username} with bet ${amount} and time ${time}. Their estimated winnings are ${winnings}`);
  }
  else {
    await UserBetsTable.create({ id: message.author.id, name: message.author.username, hasBetToday: true, currentBet: amount, wakeUpTime: time, estimatedWinnings: winnings, totalCash: 1000 });
    console.log(`Created new user ${message.author.username} with bet ${amount} and time ${time}. Their estimated winnings are ${winnings}`)
  }
}
