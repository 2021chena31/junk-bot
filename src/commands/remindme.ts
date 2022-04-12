import {
  Channel,
  Client,
  Message,
  TextBasedChannels,
  TextChannel,
} from 'discord.js'
import { db } from '../db'

interface DBReminder {
  user_id: string
  channel_id: string
  contents: string
  date_time: number
  internal_id: number
}

export async function init(client: Client) {
  let i = 0
  await (
    db
      .prepare(
        'SELECT user_id, channel_id, contents, date_time, internal_id FROM Reminders'
      )
      .all() as DBReminder[]
  ).forEach((x) => {
    console.log('I GOT ONE: ' + i)
    i++
    client.channels.fetch(x.channel_id).then((channel) => {
      if (!channel) return undefined
      if (!channel.isText()) return undefined
      console.log('ID: ' + x.internal_id)
      let reminder: Reminder = new Reminder(
        x.user_id,
        channel,
        x.contents,
        new Date(x.date_time),
        x.internal_id
      )
      hour_check_queue.push(reminder)
    })
  })
  hour_check()
  minute_check()
  setInterval(minute_check, 60000)
  setInterval(hour_check, 3600000)
}
export default (message: Message, _client: Client) => {
  let to_parse = message.content.split(' ').slice(1, undefined).join(' ')
  let [numbers, reminder] = to_parse.split('"')
  let time = 0
  for (let n of numbers.split(' ')) {
    let n_one = n[n.length - 1]
    let n_two = parseInt(n.slice(undefined, n.length - 1))
    n_two = Number.isNaN(n_two) ? 0 : n_two
    switch (n_one) {
      case 's':
        time += n_two
        break
      case 'm':
        time += n_two * 60
        break
      case 'h':
        time += n_two * 3600
        break
      case 'd':
        time += n_two * 3600 * 24
        break
      case 'w':
        time += n_two * 3600 * 24 * 7
        break
      default:
        break
    }
  }
  let date = new Date()
  date.setMilliseconds(date.getMilliseconds() + time * 1000)
  message.channel.send(
    '<@' +
      message.author.id +
      '>: Confirmed, I\'ll remind you "' +
      reminder +
      '" at ' +
      date
  )
  let changed = db
    .prepare(
      'INSERT INTO Reminders (user_id, channel_id, contents, date_time) VALUES (?, ?, ?, ?)'
    )
    .run(message.author.id, message.channel.id, reminder, date.getTime())
  let rowid = changed.lastInsertRowid
  let id = db
    .prepare('SELECT internal_id FROM Reminders WHERE rowid = ?')
    .get(rowid).internal_id as number
  //let id = db.prepare("SELECT internal_id FROM reminders WHERE user_id = ? AND channel_id = ? AND contents = ? AND date_time = ?").get(message.author.id, message.channel.id, reminder, date.getTime());
  hour_check_queue.push(
    new Reminder(message.author.id, message.channel, reminder, date, id)
  )
  hour_check()
  minute_check()
}
class Reminder {
  date: Date
  contents: String
  author_id: String
  channel_id: TextBasedChannels
  internal_id: number | undefined
  constructor(
    author_id: String,
    channel_id: TextBasedChannels,
    contents: String,
    date: Date,
    id: number | undefined = undefined
  ) {
    this.author_id = author_id
    this.channel_id = channel_id
    this.contents = contents
    this.date = date
    this.internal_id = id
  }
}
var minute_check_queue: Reminder[] = []
function minute_check() {
  var temp_queue = minute_check_queue.splice(0)
  var to_remove: boolean[] = []
  temp_queue.forEach((x) => {
    if (Number(x.date) - Number(new Date()) < 0) {
      x.channel_id.send(
        '<@' + x.author_id + '>' + ", I'm reminding you: " + x.contents
      )
      to_remove.push(true)
    } else if (Number(x.date) - Number(new Date()) < 60000) {
      to_remove.push(true)
      setTimeout(() => {
        x.channel_id.send(
          '<@' + x.author_id + '>' + ", I'm reminding you: " + x.contents
        )
      }, Number(x.date) - Number(new Date()))
    } else {
      to_remove.push(false)
    }
  })
  for (let i = 0; i < temp_queue.length; i++) {
    if (!to_remove[i]) minute_check_queue.push(temp_queue[i])
    else {
      if (temp_queue[i].internal_id != undefined) {
        console.log(temp_queue[i].internal_id)
        db.prepare('DELETE FROM Reminders WHERE internal_id = ?').run(
          temp_queue[i].internal_id
        )
      }
    }
  }
}
var hour_check_queue: Reminder[] = []
function hour_check() {
  console.log(hour_check_queue)
  let temp_queue = hour_check_queue.splice(0)
  let to_remove: boolean[] = []
  temp_queue.forEach((x) => {
    if (Number(x.date) - Number(new Date()) < 3600000) {
      to_remove.push(true)
      minute_check_queue.push(x)
    } else {
      to_remove.push(false)
    }
  })
  for (let i = 0; i < temp_queue.length; i++) {
    if (!to_remove[i]) hour_check_queue.push(temp_queue[i])
  }
}
