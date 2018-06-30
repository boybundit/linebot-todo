const express = require('express');
const moment = require('moment');
const taskModel = require('../db/task');

const router = express.Router();

function checkAuth(req, res, next) {
  if (!req.user) {
    return res.sendStatus(403);
  }
  return next();
}

router.get('/tasks', checkAuth, (req, res) => {
  return res.json(taskModel.find(req.user.id));
});

router.post('/tasks', checkAuth, (req, res) => {
  return res.json(taskModel.refresh(req.user.id, req.body));
});

module.exports = router;
