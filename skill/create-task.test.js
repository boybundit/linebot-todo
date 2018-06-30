const assert = require('assert');
const moment = require('moment');
const createTaskSkill = require('./create-task');

const event = {
  replyToken: 'nHuyWiB7yP5Zw52FIkcQobQuGDXCTA',
  type: 'message',
  timestamp: 1462629479859,
  source: {
    type: 'user',
    userId: 'U17448c796a01b715d293c34810985a4e'
  },
  message: {
    id: '325708',
    type: 'text',
    text: 'Task 1 : 3/5/18 : 13:00'
  }
}

describe('skill', function () {
  describe('#createTaskSkill()', function () {
    it('should add new task into user task list', function (done) {
      createTaskSkill(event).then(() => {
        assert.equal(event.result.type, 'flex');
        assert.equal(event.result.contents.type, 'bubble');
        assert.equal(event.result.contents.body.contents[1].text, 'Task 1');
        assert.equal(event.result.contents.body.contents[2].text, '03/05/18 13:00');
        delete event.result;
        done();
      });
    });
    it('should use default date and time', function (done) {
      event.message.text = 'Task 2';
      createTaskSkill(event).then(() => {
        assert.equal(event.result.type, 'flex');
        assert.equal(event.result.contents.type, 'bubble');
        assert.equal(event.result.contents.body.contents[1].text, 'Task 2');
        assert.equal(event.result.contents.body.contents[2].text, `${moment().format('DD/MM/YY')} 12:00`);
        delete event.result;
        done();
      });
    });
    it('should handle today', function (done) {
      event.message.text = 'Task 3 : today : 13:00';
      createTaskSkill(event).then(() => {
        assert.equal(event.result.type, 'flex');
        assert.equal(event.result.contents.type, 'bubble');
        assert.equal(event.result.contents.body.contents[1].text, 'Task 3');
        assert.equal(event.result.contents.body.contents[2].text, `${moment().format('DD/MM/YY')} 13:00`);
        delete event.result;
        done();
      });
    });
    it('should handle tomorrow', function (done) {
      event.message.text = 'Task 3 : tomorrow : 14:00';
      createTaskSkill(event).then(() => {
        assert.equal(event.result.type, 'flex');
        assert.equal(event.result.contents.type, 'bubble');
        assert.equal(event.result.contents.body.contents[1].text, 'Task 3');
        assert.equal(event.result.contents.body.contents[2].text, `${moment().add(1, 'days').format('DD/MM/YY')} 14:00`);
        delete event.result;
        done();
      });
    });
  });
});
