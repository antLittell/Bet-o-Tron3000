const fs = require('fs');
const { Client, GatewayIntentBits, Events, Discord, Collection } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = new Collection();

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

    try {
        command.execute(message, args);
    } catch (err) {
        console.error(err);
        message.reply('there was an error trying to execute that command!');
    }

});

client.login(token);