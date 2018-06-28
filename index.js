/*require('dotenv').config()
const linebot = require('linebot');

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

bot.on('message', require('./skill/create-task'));

bot.listen('/linewebhook', process.env.PORT || 3000);
*/
require('dotenv').config()
const express = require('express');
const line = require('@line/bot-sdk');
const createTaskSkill = require('./skill/create-task');

const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken:  process.env.CHANNEL_ACCESS_TOKEN 
};
const client = new line.Client(config);
const app = express();

app.post('/linewebhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  Promise
    .all([createTaskSkill(event)])
    .then(() => {
      if (!event.result) {
        return Promise.resolve(null);
      }
      return client.replyMessage(event.replyToken, event.result);
    });  
}

app.listen(process.env.PORT || 3000);
