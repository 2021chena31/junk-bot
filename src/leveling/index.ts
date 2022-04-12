import { Client, Message, User } from 'discord.js'
import LRU from 'lru-cache'

import { db } from '../db'

// This is the time in milliseconds before a user can be granted XP again.
const MAX_AGE = 10 * 1000

// Least-recently-used cache; stores user IDs for a certain amount of time
// so that we can easily check if they've sent a message recently.
const cache = new LRU({
  max: 500,
  maxAge: MAX_AGE,
})

/**
 * Normalizes a discord ID to what's stored in the DB.
 * This is needed because otherwise sqlite will interpret it as an integer
 * in weird, unexpected ways.
 * @param id The ID to normalize.
 * @returns The normalized ID.
 */
const normalizeId = (id: string) => (id.startsWith('id') ? id : `id${id}`)

/**
 * Gets the level of a user based on the amount of XP they have.
 * @param xp The amount of experience they have.
 * @returns The number of levels they have.
 */
export const level = (xp: number) => Math.floor(Math.sqrt(xp / 10))

/**
 * A user from the database, along with their level.
 */
interface DBUser {
  /**
   * The user's id, normalized.
   */
  user_id: string
  /**
   * The amount of experience points this user has.
   */
  xp: number

  /**
   * The level of the user.
   */
  level: number
}

/**
 * Gets a user from the database.
 * @param id The user ID to get.
 * @returns The user as stored by the DB.
 */
export const getUser = (id: string) => {
  id = normalizeId(id)
  const user = db
    .prepare(
      `
    select user_id, xp
    from UserXP
    where user_id = ?
  `
    )
    .get(id) as DBUser | undefined

  // If we didn't get a user, add them to the database.
  if (!user) {
    db.prepare(
      `
    insert into UserXP (user_id, xp)
    values (?, ?)
    `
    ).run(id, 0)
    return {
      user_id: id,
      xp: 0,
      level: 0,
    } as DBUser
  } else {
    return { ...user, level: level(user.xp) }
  }
}

interface LeaderboardUser {
  inDiscord: User
  inDatabase: DBUser
}

/**
 * Gets the users with the most XP.
 * @param client The client to find the actual discord users from.
 * @returns The users with the most XP.
 */
export const leaderboard = async (client: Client) => {
  const users = db
    .prepare(
      `
    select user_id, xp
    from UserXP
    order by xp desc
  `
    )
    .get()
  console.log(users)
}

const grant = (id: string, xp: number) => {
  id = normalizeId(id)
  const user = getUser(id)
  xp += user.xp
  db.prepare(
    `
    update UserXP
    set xp = ?
    where user_id = ?
    `
  ).run(xp, id)
}

export const onMessage = (message: Message) => {
  const { author } = message
  const id = normalizeId(author.id)
  // If this ID has sent a message in the last five seconds,
  if (!cache.get(id)) {
    if (Math.random() > 0.2) {
      grant(id, 1)
    }
    cache.set(id, true)
  }
}
