import { Client, Message } from 'discord.js'

export default (message: Message, _client: Client) => {
  let to_parse = message.content.split(' ').slice(1, undefined).join()
  message.channel.send('pong ' + to_parse)
}
