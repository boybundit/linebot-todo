require('dotenv').config()
const express = require('express');
const passport = require('passport');
const LineStrategy = require('passport-line-auth').Strategy;
const jwt = require('jsonwebtoken');
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

passport.use(new LineStrategy({
  channelID: process.env.WEB_CHANNEL_ID,
  channelSecret: process.env.WEB_CHANNEL_SECRET,
  callbackURL: process.env.WEB_CALLBACK_URL,
  scope: ['profile', 'openid', 'email'],
  botPrompt: 'normal'
},
function(accessToken, refreshToken, params, profile, cb) {
  const {email} = jwt.decode(params.id_token);
  profile.email = email;
  return cb(null, profile);
}));

// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, cb) {cb(null, user);});
passport.deserializeUser(function(obj, cb) {cb(null, obj);});

// Use application-level middleware for common functionality, including
// parsing, and session handling.
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: process.env.CHANNEL_SECRET, resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/', function(req, res) {
  if (!req.user) {
    return res.redirect('/login/line');
  }
  res.send('Hello World ' + JSON.stringify(req.user));
});

app.get('/login/line', passport.authenticate('line'));

app.get('/login/line/return',
  passport.authenticate('line', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.use(taskMiddleware);

app.listen(process.env.PORT || 3000, () => console.log('Started'));
