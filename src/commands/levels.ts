import { Client, Message } from 'discord.js'
import dedent from 'ts-dedent'
import { getUser } from '../leveling'

export default (message: Message, _client: Client) => {
  const parts = message.content.split(' ')
  // Get rid of the initial c!levels.
  parts.shift()
  switch (parts[0]) {
    // c!levels get
    case 'get':
      const { level, xp } = getUser(message.author.id)

      const nextLevelXP = 10 * Math.pow(level + 1, 2)
      const toNextLevel = nextLevelXP - xp

      // 0 levels, 1 level, 2 levels, 3 levels, et cetera
      const levelText = `**${level}** level` + (level == 1 ? '' : 's')
      message.channel.send(dedent`
        You have ${levelText} *(${xp}XP)*.
        To get to level ${level + 1}, you need **${toNextLevel} more XP.**
        `)
      break
    // c!levels leaderboard
    case 'leaderboard':
      break
  }
}
