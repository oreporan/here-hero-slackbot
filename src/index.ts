import {App}  from '@slack/bolt';
import * as bot from './bot'
require('dotenv').config()

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});


(async () => {
  await app.start(process.env.PORT || 3000);
  bot.start(app)
  console.log('⚡️ HereHero app is running!');
})();