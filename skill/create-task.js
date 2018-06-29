const moment = require('moment');
const taskModel = require('../db/task');

function createTaskSkill(event) {
  if (!event.message.text) {
    return Promise.resolve(null);
  }
  if (event.message.text == 'List') {
    const userTask = taskModel.find(event.source.userId);
    event.result = { type: 'text', text: JSON.stringify(userTask) };
    return Promise.resolve(event.result);
  }
  const params = event.message.text.split(' : ');
  const task = params[0];
  if (!params[1] || params[1] === 'today') {
    params[1] = moment().format('DD/MM/YY');
  }
  if (params[1] === 'tomorrow') {
    params[1] = moment().add(1, 'days').format('DD/MM/YY');
  }
  if (!params[2]) {
    params[2] = '12:00';
  }
  const date = moment(`${params[1]} ${params[2]}`, 'DD/MM/YY HH:mm');
  const userId = event.source.userId;
  taskModel.add(userId, {
    task,
    date: date.format(),
    important: false,
    done: false
  });
  event.result = {
    "type": "bubble",
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "TODO",
          "weight": "bold",
          "color": "#1DB446",
          "size": "sm"
        },
        {
          "type": "text",
          "text": `${task}`,
          "weight": "bold",
          "size": "xxl",
          "margin": "md"
        },
        {
          "type": "text",
          "text": `${date.format('DD/MM/YY HH:mm')}`,
          "size": "xs",
          "color": "#aaaaaa",
          "wrap": true
        },
        {
          "type": "separator",
          "margin": "xxl"
        },
        {
          "type": "box",
          "layout": "horizontal",
          "margin": "md",
          "contents": [
            {
              "type": "button",
              "style": "link",
              "action":
              {
                "type": "uri",
                "label": "Edit",
                "uri": "https://linebot-todo.heroku.com/"
              }
            }
          ]
        }
      ]
    }
  };
  return Promise.resolve(event.result);
}

module.exports = createTaskSkill;
