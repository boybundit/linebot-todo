const express = require('express');
const moment = require('moment');

const router = express.Router();

const tasks = [
  { userId: 'U17448c796a01b715d293c34810985a4c', tasks: [{ id: '0', task:'', date: moment().format()}] },
  { userId: 'U17448c796a01b715d293c34810985a4d', tasks: [] },
  { userId: 'U17448c796a01b715d293c34810985a4e', tasks: [] }
]; // mock db

router.get('/tasks', (req, res) => {
  return res.json(tasks);
});

module.exports = router;
