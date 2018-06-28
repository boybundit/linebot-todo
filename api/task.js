const express = require('express');
const moment = require('moment');

const router = express.Router();

const tasks = [
  { userId: 'U17448c796a01b715d293c34810985a4c', tasks: [{ id: '0', task:'', date: moment().format()}] },
  { userId: 'U17448c796a01b715d293c34810985a4d', tasks: [] },
  { userId: 'U17448c796a01b715d293c34810985a4e', tasks: [] }
]; // mock db

function checkAuth(req, res, next) {
  if (!req.user) {
    return res.sendStatus(403);
  }
  return next();
}

router.get('/tasks', checkAuth, (req, res) => {
  return res.json(tasks.filter(task => task.userId === req.user.id));
});

module.exports = router;
