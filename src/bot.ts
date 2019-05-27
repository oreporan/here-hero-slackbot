import {App}  from '@slack/bolt';

export const start = (app: App) => {
    
app.command('/hereo', async ({ command, ack, say }) => {
    ack()
    try {
      say("Calculating the channel's @here \"hero\"")
      const messages = await getMessages(app, command.channel_id)
      const hereKing = calculateHereHero(messages)
      say(`The Here Hero is: <@${hereKing.user}> with ${hereKing.here} heres`)
    } catch (error) {
      console.error(error);
      console.error(JSON.stringify(error.data));
      say(`Something is broken with the Here Hero Bot...`) 
    }
  });
}

  const getMessages = async (app: App, channel: any) => {
    let messages = []
    let channelHistory = await app.client.channels.history({
      channel,
      count: 1000,
      token: process.env.USER_TOKEN
    }) as any

    messages = channelHistory.messages;

    if (channelHistory.has_more) {
      const lastMsg = channelHistory.messages[channelHistory.messages.length -1]
      const latest = lastMsg && lastMsg.ts
      channelHistory = await app.client.channels.history({
        channel,
        latest,
        count: 1000,
        token: process.env.USER_TOKEN
      }) as any
      messages.concat(channelHistory.messages)
    }

    return messages
  }

  const calculateHereHero = (messages: any) => {
      const candidates = messages.filter((x: any) => !x.subtype).reduce((all: any, msg: any) => {
          const hasHere = msg.text && (msg.text.includes('<!here>') || msg.text.includes('<!channel>'))
          if (!hasHere) return all;
          all[msg.user] = all[msg.user] ? all[msg.user] +1 : 1
          return all;
      }, {})

      const user = Object.keys(candidates).sort((a, b) => candidates[b] - candidates[a])[0]
      return {user, here: candidates[user]}
  }