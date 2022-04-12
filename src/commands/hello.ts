import { Client, Message } from 'discord.js'

export default (message: Message, _client: Client) => {
  message.channel.send('hi!')
}
