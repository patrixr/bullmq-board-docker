# BullMQ Board Docker Image

Runs [Bull Board](https://github.com/vcapretz/bull-board) in a small express server.

## Running

```sh
docker run -p 3000:3000 -e REDIS_URL=redis://host.docker.internal patrixr/bullmq-board
```

## Environment variables

- `REDIS_URL` The redis connection string
- `BULL_PREFIX` Redis key prefix (defaults to bull)
- `BASE_PATH` The sub url on which to mount the dashboard (defaults to /)
- `PORT` The port to run on (defaults to 3000)
