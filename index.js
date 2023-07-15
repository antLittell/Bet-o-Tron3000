const fs = require('fs');
const { Client, GatewayIntentBits, Events, Collection } = require('discord.js');
const { token } = require('./config.json');
const sequelize = require('./data/sqliteConfig');
const Sequelize = require('sequelize');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = new Collection();

// Updates whenever user places bet
const UserBetsTable = sequelize.define('user-bets', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    hasBetToday: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    currentBet: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    wakeUpTime: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    potTime: {
        type: Sequelize.STRING,
    },
    estimatedWinnings: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    totalCash: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 1000
    },
});

// Updated whenever Elias wakes up
const DailiesTable = sequelize.define('dailies', {
    date: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
    },
    timeWoken: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    averageTime: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    pot: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    std: {
        type: Sequelize.FLOAT,
        allowNull: false,
    }
});

const LeaderBoardTable = sequelize.define('leaderboard', {
    place: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    winners: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    losers: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

sequelize.sync() // Creates the table if it doesn't exist
    .then(() => console.log('SQLite database and table are ready'))
    .catch(err => console.error('Error setting up the database:', err));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
}

const prefix = 'e!';

client.once(Events.ClientReady, () => {
    console.log('Ready!');
});

client.on(Events.MessageCreate, function (message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);

    console.log(args[0]);
    console.log(commands);

    if (args[0] === 'help') {
        commands.get('help').execute(message, args[1], commands);
        return;
    }

    const command = commands.get(args[0]);

    const arguments = {
        userBetsTable: UserBetsTable,
        dailiesTable: DailiesTable,
        leaderBoardTable: LeaderBoardTable,
        args: args
    };

    try {
        command.execute(message, arguments);
    } catch (err) {
        console.error(err);
        message.reply('there was an error trying to execute that command!');
    }

});

client.login(token);