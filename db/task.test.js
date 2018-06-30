const assert = require('assert');
const moment = require('moment');
const task = require('./task.js');

let userTask = {
  userId: 'U17448c796a01b715d293c34810985a4e',
  tasks: [{
    task: 'Test',
    date: moment().format()
  }]
};

describe('db/task', function () {
  describe('#add()', function () {
    it('should add new task into user task list', function () {
      const result = task.add(userTask.userId, userTask.tasks[0]);
      assert.equal(result[0].task, userTask.tasks[0].task);
      userTask.tasks = result;
    });
  });
  describe('#find()', function () {
    it('should return user task list', function () {
      const result = task.find(userTask.userId);
      assert.equal(result[0].task, userTask.tasks[0].task);
    });
  });
  describe('#update()', function () {
    it('should update user task list', function () {
      const result = task.update(userTask.userId, Object.assign({}, userTask.tasks[0], { task: 'x' }));
      assert.equal(result[0].task, 'x');
    });
  });
  describe('#refresh()', function () {
    it('should update refresh task list', function () {
      const task2 = { task: 'Test 2', date: moment().format() };
      task.add(userTask.userId, task2);
      userTask.tasks = task.find(userTask.userId);
      userTask.tasks[0].done = true;
      userTask.tasks[1].important = true;
      const result = task.refresh(userTask.userId, userTask.tasks);
      assert.equal(result[0].done, true);
      assert.equal(result[1].important, true);
    });
  });
});
