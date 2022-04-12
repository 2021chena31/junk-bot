import { Client, Message } from 'discord.js'

export default (message: Message, _client: Client) => {
  message.channel.send(
    '```Command List:\n' +
      'c!help -> sends information about available commands\n' +
      "c!hello -> say 'hi!'\n" +
      "c!ping -> sends back 'pong' plus anything else after the command\n"+
      "c!jokes -> sends a joke (c!joke math for a math joke)\n"+
      "c!setnick -> sets nickname of mentioned user (eg. c!setnick @user new name)\n"+
      "(ps. please don't set the nickname of my phone, it will crash the bot.)"+
      "```"
  )
}
