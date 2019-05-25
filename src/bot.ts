import {App}  from '@slack/bolt';

export const start = (app: App) => {
    
app.command('/hereo', async ({ command, ack, say }) => {
    ack()
    try {
      say("Calculating the channel's @here \"hero\"")
      const channelHistory = await app.client.channels.history({
        channel: command.channel_id,
        token: process.env.USER_TOKEN
      })
      const hereKing = calculateHereHero(channelHistory)
      say(`The Here Hero is: <@${hereKing.user}> with ${hereKing.here} heres`)
    } catch (error) {
      console.error(error);
      console.error(JSON.stringify(error.data));
      say(`Something is broken with the Here Hero Bot...`) 
    }
  });
}

  const calculateHereHero = (channelHistory: any) => {
      const candidates = channelHistory.messages.filter((x: any) => !x.subtype).reduce((all: any, msg: any) => {
          const hasHere = msg.text && (msg.text.includes('<!here>') || msg.text.includes('<!channel>'))
          if (!hasHere) return all;
          all[msg.user] = all[msg.user] ? all[msg.user] +1 : 1
          return all;
      }, {})

      const user = Object.keys(candidates).sort((a, b) => candidates[a] - candidates[b])[0]
      return {user, here: candidates[user]}
  }