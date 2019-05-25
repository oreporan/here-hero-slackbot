import {App}  from '@slack/bolt';
import * as bot from './bot'

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN || 'xoxb-634534093251-648326697942-qRduH4Q7LZmcASdRaFQ1VRSb',
});


(async () => {
  await app.start(process.env.PORT || 3000);
  bot.start(app)
  console.log('⚡️ HereYe app is running!');
})();