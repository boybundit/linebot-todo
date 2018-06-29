const moment = require('moment');
const task = require('../db/task');

function createTaskSkill(event) {
  if (!event.message.text) {
    return Promise.resolve(null);
  }
  if (event.message.text == 'List') {
    const userTask = task.find(event.source.userId);
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
  task.add(userId, {
    task,
    date,
    important: false,
    done: false
  });
  event.result = {
    type: 'text',
    text: `Task "${task}" created.`
  };
  return Promise.resolve(event.result);
}

module.exports = createTaskSkill;
