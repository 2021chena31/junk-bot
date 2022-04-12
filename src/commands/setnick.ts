import { Client, Message } from 'discord.js'

//sends a bad joke into chat
export default (message: Message, _client: Client) => {
  //let genre = message.content.split(' ').slice(1, undefined).join()
    let args = message.content.split(' ');
    //message.channel.send(args);

    let userMention = message.mentions.users.first();
    let userNick = args[2];

    let i = 3;
    while (args[i] != null){
        userNick += ' ' +args[i]
        i++
    }

    if (userMention == null){
        message.channel.send("Please mention a user to set the nickname of.");
    } else {
        let userID = userMention.id;
        //message.guild.members.get(userID).setNickname(userNick);
        message.guild.members.cache.get(userID).setNickname(userNick);
        //message.mentions.
        //message.channel.send(joke);
    }



}
