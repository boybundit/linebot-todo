const moment = require('moment');

// uuidv4 just for fun https://gist.github.com/jed/982883
function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)}

const taskList = [
  { userId: 'U17448c796a01b715d293c34810985a4c', tasks: [{ id: b(), task:'Task 1', date: moment().format()}] }
]; // mock db

const taskModel = {};

taskModel.find = (userId) => {
  const userTask = taskList.find(d => d.userId === userId);
  if (!userTask) {
    return null;
  }
  return userTask.tasks;
};

taskModel.add = (userId, task) => {
  let userTask = taskList.find(d => d.userId === userId);
  if (!userTask) {
    userTask = { userId: userId, tasks: [] };
    taskList.push(userTask);
  }
  userTask.tasks.push(Object.assign({ id: b() }, task));
  return userTask.tasks;
};

taskModel.update = (userId, task) => {
  const userTask = taskList.find(d => d.userId === userId);
  if (!userTask) {
    return;
  }
  const currentTask = userTask.tasks.find(d => d.id === task.id);
  if (!currentTask) {
    return;
  }
  Object.assign(currentTask, task);
  return userTask.tasks;
};

taskModel.refresh = (userId, tasks) => {
  const userTask = taskList.find(d => d.userId === userId);
  if (!userTask) {
    return;
  }
  userTask.tasks = tasks;
  return userTask.tasks;
};

module.exports = taskModel;
