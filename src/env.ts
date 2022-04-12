import dotenv from 'dotenv'

// Get environment variables from the .env file
dotenv.config()

export const token = process.env.TOKEN as string

if (!token) {
  console.error('Please put a token in the .env file!')
  console.error('Ask in the discord for help, if you need it.')
  process.exit(1)
}

export const nodeEnv = process.env.NODE_ENV as string
