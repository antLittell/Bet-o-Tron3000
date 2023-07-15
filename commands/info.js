module.exports = {
    name: 'info',
    description: 'Get data on all users or a certain user. Usage: e!info or e!info <@user>',
    async execute(message, arguments) {
        const args = arguments.args;
        const UserBetsTable = arguments.userBetsTable;
        let users = [];
        let infoMessage = "";

        if (args.length > 1) {
            users = Array.from(message.mentions.users.keys());
        }
        else {
            users = await getAllIDs(UserBetsTable);
        }

        console.log(users)

        for (const user of users) {
            infoMessage += await getUserInfo(user, UserBetsTable);
        }

        message.reply(infoMessage);
    }
}

async function getUserInfo(user, UserBetsTable) {
    const userRow = await UserBetsTable.findOne({ where: { id: user } });
    let infoString = "";

    if (userRow) {
        infoString += `${userRow.name} has bet ${userRow.currentBet} dollars on Elias waking up around ${userRow.wakeUpTime}.`;
        if (userRow.potTime) {
            infoString += ` The pot time is ${userRow.potTime}.`;
        }
        infoString += `Their total cash now is ${userRow.totalCash}. \n\n`;
    }
    else {
        infoString += `${user} has not placed a bet yet. \n\n`;
    }

    return infoString;
}

async function getAllIDs(UserBetsTable) {
    try {
        // Find all rows in the table
        const allRows = await UserBetsTable.findAll();
        console.log(allRows)

        // Extract the IDs from the results
        const allIDs = allRows.map((row) => row.id.toString());

        return allIDs;
    } catch (err) {
        console.error('Error getting all IDs:', err);
        return [];
    }
}