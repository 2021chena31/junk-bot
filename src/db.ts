import sqlite from 'better-sqlite3'
import { join } from 'path'

export const db = new sqlite(join(__dirname, '../db/bot.db'))
