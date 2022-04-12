const db = require('better-sqlite3')('db/bot.db')
const { readFileSync } = require('fs')

const schema = readFileSync('./schema.sql').toString()
db.exec(schema)
