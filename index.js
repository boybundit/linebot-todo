require('dotenv').config()
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const LineStrategy = require('passport-line-auth').Strategy;
const jwt = require('jsonwebtoken');
const path = require('path');
const line = require('@line/bot-sdk');
const createTaskSkill = require('./skill/create-task');
const taskMiddleware = require('./api/task');
const bodyParser = require('body-parser')

const config = {
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken:  process.env.CHANNEL_ACCESS_TOKEN 
};

const client = new line.Client(config);
const app = express();

app.use(helmet.noCache());
app.use(cors());

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
    })
    .catch(console.error);
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

passport.serializeUser(function(user, cb) { cb(null, user); });
passport.deserializeUser(function(obj, cb) { cb(null, obj); });

app.use(bodyParser.json());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: process.env.CHANNEL_SECRET, resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/login/line', passport.authenticate('line'));
app.get('/login/line/return',
  passport.authenticate('line', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

function checkAuth(req, res, next) {
  if (!req.user) {
    return res.redirect('/login/line');
  }
  return next();
}
app.get('/', checkAuth);
app.use(express.static(path.join(__dirname, './web/build')));

app.use(taskMiddleware);

app.listen(process.env.PORT || 80, () => console.log('Started'));
