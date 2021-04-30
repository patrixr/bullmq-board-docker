const { createBullBoard } = require('bull-board')
const { BullMQAdapter }   = require('bull-board/bullMQAdapter')
const { Queue }           = require('bullmq')
const express             = require('express')
const Redis               = require('ioredis')
const _                   = require('lodash')

const {
  BULL_PREFIX = 'bull',
  BASE_PATH = '/',
  PORT = 3000,
  REDIS_URL,
} = process.env;

(async function() {

  const redis = new Redis(REDIS_URL);

  const buildQueues = async () => {
    const keys = await redis.keys(`${BULL_PREFIX}:*`);
    return _.chain(keys)
    .map(k => k.replace(/^.+?:(.+?):.+?$/, '$1'))
    .uniq()
    .map(name => new Queue(name, { connection: redis }))
    .value();
  }

  const { router, replaceQueues } = createBullBoard(
    (await buildQueues()).map(q => new BullMQAdapter(q))
  )

  const app = express();

  app.post('_reload', async (_, res) => {
    replaceQueues(await buildQueues());
    res.json({ ok: true });
  })

  app.use(BASE_PATH, router);

  app.listen(PORT, () => {
    console.log(`bull-board listening on host:${PORT}${BASE_PATH}`);
  });
})();
