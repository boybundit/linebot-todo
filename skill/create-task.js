const moment = require('moment');

const tasks = []; // mock db

function createTaskSkill(event) {
  if (!event.message.text) {
    return Promise.resolve(null);
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
  tasks.push({
    userId,
    task,
    date,
    important: false,
    finished: false
  });
  event.result = {
    type: 'text',
    text: `Task "${task}" created.`
  };
  return Promise.resolve(event.result);
}

module.exports = createTaskSkill;
