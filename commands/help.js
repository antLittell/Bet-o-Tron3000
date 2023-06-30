module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    execute(message, arg, commands) {
        if (!arg) {
            return message.reply(`Here's a list of all my commands:\n${commands.map(command => command.name).join(', ')}\nYou can send \`e!help [command name]\` to get info on a specific command!`);
        }
        try {
            message.reply(commands.get(arg).description);
        } catch (err) {
            message.reply('that\'s not a valid command!');
        }

    }
}