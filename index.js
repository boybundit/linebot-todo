require('dotenv').config()
const express = require('express');
const line = require('@line/bot-sdk');
const createTaskSkill = require('./skill/create-task');
const taskMiddleware = require('./api/task');

const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken:  process.env.CHANNEL_ACCESS_TOKEN 
};
const client = new line.Client(config);
const app = express();

app.post('/linewebhook', line.middleware(config), (req, res) => {
  console.log(req.body.events);
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

function handleEvent(event) {
  console.log(event);
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

app.use(taskMiddleware);

app.listen(process.env.PORT || 3000);
