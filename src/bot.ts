import {App}  from '@slack/bolt';

export const start = (app: App) => {
    
app.message('here ye here ye', async ({ message, say }) => {
  console.log("Rockn Roll")
    try {
      say(`Calculating (shame) king of heres...`)
      const channelHistory = await app.client.channels.history({
        channel: message.channel,
        token: process.env.USER_TOKEN
      })
      const hereKing = calculateHereKing(channelHistory)
      const userName = await app.client.users.info({
        token: process.env.USER_TOKEN,
        user: hereKing.user
      }) as any;
      say(`The king of heres is: @${userName.user.name} with ${hereKing.here} heres`)
    } catch (error) {
      console.error(error);
      console.error(JSON.stringify(error.data));
    }
  });
}



  const calculateHereKing = (channelHistory: any) => {
      const candidates = channelHistory.messages.filter((x: any) => !x.subtype).reduce((all: any, msg: any) => {
          const hasHere = msg.text && (msg.text.includes('<!here>') || msg.text.includes('<!channel>'))
          if (!hasHere) return all;
          all[msg.user] = all[msg.user] ? all[msg.user] +1 : 1
          return all;
      }, {})

      const user = Object.keys(candidates).sort((a, b) => candidates[a] - candidates[b])[0]
      return {user, here: candidates[user]}
  }