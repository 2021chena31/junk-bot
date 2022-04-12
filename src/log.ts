import chalk from 'chalk'
import { nodeEnv } from './env'

const formatOptions: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
}

const formatter = new Intl.DateTimeFormat('en-US', formatOptions)

const time = () => chalk.gray(formatter.format(new Date()))

const _log = (prefix: string, message: any[]) =>
  // The joining here instead of just passing in another argument
  // is so that there won't be an extraneous space with `log`.
  console.log(time() + (prefix ? ` ${prefix}` : ''), ...message)

export const log = (...message: any[]) => _log('', message)

export const debug = (...message: any[]) => {
  if (nodeEnv === 'DEBUG') {
    _log(chalk.blue('DEBUG:'), message)
  }
}

export const warn = (...message: any[]) => _log(chalk.yellow('WARN:'), message)

export const error = (...message: any[]) => _log(chalk.red('ERROR:'), message)
