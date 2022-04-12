# Social Coding Discord Bot

A discord bot made in the social coding club!

## Installing

Run these commands in your favorite terminal (PowerShell, Terminal.app, urxvt, etc):

```sh
git clone https://github.umn.edu/KENYO133/discord-bot.git && cd discord-bot

npm install

npm run start
```

## Development

Usually, you'll want to run `npm run start:dev`. This will start the bot,
and restart it any time you change the files.

### Debug mode

If you want some helpful debug messages, you should turn on debug mode!

#### For Windows

In PowerShell:

```
$env:NODE_ENV="DEBUG"

npm run start:dev
```

In cmd.exe:

```
set NODE_ENV=DEBUG&&npm run start:dev
```

#### For Mac and Linux (and any other POSIX-y system)

```
NODE_ENV=DEBUG npm run start:dev
```

### Adding a command

1. Make a new file for your command in `src/commands/`
1. Write the command as a default export function - see `src/commands/hello.ts`
1. Add it to the commands array in `src/commands/index.ts`

## Committing

Before you commit, please run `npm run lint`! Otherwise the styles will get
very different very quickly.

```
git add .
git commit
git push origin main
```

## License

MIT
