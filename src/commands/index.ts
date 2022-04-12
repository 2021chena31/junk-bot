import hello from './hello'
import { Message, Client } from 'discord.js'
import ping from './ping'
import remindme from './remindme'
import help from './help'
import levels from './levels'
import joke from './joke'
import setnick from './setnick'

type CommandFunction = (message: Message, client: Client) => any
type CommandObject = Record<string, CommandFunction>

const commands: CommandObject = {
  hello,
  ping,
  remindme,
  help,
  levels,
  joke,
  setnick,
}

export default commands
