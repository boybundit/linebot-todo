require('dotenv').config()
const linebot = require('linebot');

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

bot.on('message', require('./skill/create-task'));

bot.listen('/linewebhook', process.env.PORT || 3000);
