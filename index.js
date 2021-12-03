/* eslint-disable no-console */
/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
if (!process.env.NODE_ENV) {
  require('dotenv').config();
}

const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const { Queue } = require('bullmq');
const session = require('express-session');
const bodyParser = require('body-parser');

const { ensureLoggedIn } = require('connect-ensure-login');
const express = require('express');
const Redis = require('ioredis');
const _ = require('lodash');
const passport = require('./passport');

const {
  BULL_PREFIX = 'bull',
  PORT = 3000,
  REDIS_URL,
  REDIS_SSL,
} = process.env;

const start = async () => {
  const options = REDIS_SSL ? { tls: {} } : {};
  const redis = new Redis(REDIS_URL, options);
  const LOGIN_PATH = '/ui/login';

  const buildQueues = async () => {
    const keys = await redis.keys(`${BULL_PREFIX}:*`);
    return _.chain(keys)
      .map((k) => k.replace(/^.+?:(.+?):.+?$/, '$1'))
      .uniq()
      .map((name) => new Queue(name, { connection: redis }))
      .value();
  };

  const app = express();

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/ui');

  createBullBoard({
    queues: (await buildQueues()).map((q) => new BullMQAdapter(q)),
    serverAdapter,
  });

  // Configure view engine to render EJS templates.
  app.set('views', `${__dirname}/views`);
  app.set('view engine', 'ejs');

  app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }));

  app.use(bodyParser.urlencoded({ extended: false }));

  // Initialize Passport and restore authentication state, if any, from the session.
  app.use(passport.initialize({}));
  app.use(passport.session({}));

  app.get(LOGIN_PATH, (req, res) => res.render('login'));

  app.post(
    LOGIN_PATH,
    passport.authenticate('local', { failureRedirect: LOGIN_PATH }),
    (req, res) => res.redirect('/ui'),
  );

  app.get('/', (req, res) => res.redirect('/ui'));

  app.use(
    '/ui',
    ensureLoggedIn({ redirectTo: LOGIN_PATH }),
    serverAdapter.getRouter(),
  );

  app.listen(PORT, () => {
    console.log(`bull-board listening on host:${PORT}`);
  });
};

start().catch((e) => console.error(e));
