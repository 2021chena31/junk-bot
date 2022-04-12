import Discord, { Intents, Message } from 'discord.js'
import commands from './commands'
import { init } from './commands/remindme'
import { token } from './env'
import { onMessage } from './leveling'
import { log, debug } from './log'

const client = new Discord.Client({
  // Tell Discord that we'd like to receive:
  intents: [
    Intents.FLAGS.GUILD_MESSAGES, // messages sent in servers,
    Intents.FLAGS.GUILDS, // info about the servers we're in,
    Intents.FLAGS.DIRECT_MESSAGES, // and messages sent in DMs.
  ],
})

// The prefix for the bot.
const prefix = 'c!'

client
  // Called when the bot has logged into Discord.
  .on('ready', () => {
    const tag = client?.user?.tag
    const id = client?.user?.id
    const link = `https://discord.com/oauth2/authorize?client_id=${id}&scope=bot`
    log(`Logged in as ${tag}!`)
    log(`You can invite the bot at ${link}`)
    init(client)
  })
  // Called every time we get a message.
  .on('messageCreate', (message: Message) => {
    onMessage(message)

    debug('got a message')
    const { content, author } = message
    // If the message starts with our prefix, and it isn't from us:
    if (content.startsWith(prefix) && author.id !== client?.user?.id) {
      debug('got a command')
      // This removes the first occurrence of the prefix from the message.
      const command = content.replace(prefix, '')

      // Next, look in our commands array for the command.
      for (const [name, fn] of Object.entries(commands)) {
        // If the message sent then has the name of the command, call the
        // function defined for the command.
        if (command.startsWith(name)) {
          debug(`got command ${name}, running...`)
          fn(message, client)
        }
      }
    }
  })
  // Finally, log in.
  .login(token)
