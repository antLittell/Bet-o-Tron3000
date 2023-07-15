const { get } = require('http');

module.exports = {
    name: 'spotted',
    description: 'Used to indicate that Elias has been spotted. Format is e!spotted <HH:MM>',
    async execute(message, arguments) {

        const args = arguments.args;
        const UserBetsTable = arguments.userBetsTable;
        const DailiesTable = arguments.dailiesTable;
        const LeaderBoardTable = arguments.leaderBoardTable;

        const timeRegex = new RegExp('(1[0-2]|0?[1-9])(:([0-5][0-9]))?');

        let spottedTime = " ";

        if (args.length < 2) {
            message.reply('You need to at least specify a time');
            return;
        }

        spottedTime = args[1];

        if (!timeRegex.test(spottedTime)) {
            message.reply('That doesn\'t seem to be a valid time');
            return;
        }

        let messageReply = `Eli spotted at ${spottedTime}`;

        try {
            await updateSpotted(message, spottedTime, UserBetsTable, DailiesTable, LeaderBoardTable);
        } catch (err) {
            console.error(err);
            messageReply = 'There was an error trying to execute that command!';
        } finally {
            message.reply(messageReply);
        }

    }
}

async function updateSpotted(message, time, UserBetsTable, DailiesTable) {
    //convert message.timestamp to full date
    const fullDate = new Date(message.createdTimestamp);
    const date = fullDate.toLocaleDateString();

    //get the total amount of everyones bets from the UserBetsTable
    const totalBets = await UserBetsTable.sum('currentBet');

    const allTimeWoken = await DailiesTable.findAll({ attributes: ['timeWoken'] });
    let allTimeWokenArray = [];
    allTimeWokenArray = allTimeWoken.map(time => time.timeWoken);
    allTimeWokenArray.push(time);

    const averageTime = getAverageTime(allTimeWokenArray);

    const standardDeviation = getStandardDeviation();

    console.log(date + " " + time + " " + averageTime + " " + totalBets + " " + standardDeviation);

    // add row to table with date, time, average time, total bets, standard deviation

    // see who won the bet and pot and update their balance

}

function getAverageTime(timeArray) {
    let averageMinutes = 0;

    for (let i = 0; i < timeArray.length; i++) {
        averageMinutes += parseFloat(convertTimeToMinutes(timeArray[i]));
    }

    return convertMinutesToTime(averageMinutes / timeArray.length);

}

function convertTimeToMinutes(time) {
    if (time.includes(':')) {
        const timeArray = time.split(':');
        const hours = parseInt(timeArray[0]);
        const minutes = parseInt(timeArray[1]);
        return hours * 60 + minutes;
    }
    else {
        return parseInt(time) * 60;
    }
}

function convertMinutesToTime(minutes) {
    if (minutes > 60) {
        const hours = Math.floor(minutes / 60);
        const minutesLeft = minutes % 60;
        return `${hours}:${minutesLeft}`;
    }
    else {
        if (minutes < 10) {
            return `00:0${minutes}`;
        }
        return `00:${minutes}`;
    }
}

function getStandardDeviation() {
    const fs = require('fs');
    const fileData = fs.readFileSync('./data/data.json', 'utf-8');
    const jsonData = JSON.parse(fileData);
    const stdValue = jsonData.std;
    return stdValue;
}

function getMean() {
    const fs = require('fs');
    const fileData = fs.readFileSync('./data/data.json', 'utf-8');
    const jsonData = JSON.parse(fileData);
    const meanValue = jsonData.mean;
    return meanValue;
}

