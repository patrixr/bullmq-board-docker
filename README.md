# BullMQ Board Docker Image

Runs [Bull Board](https://github.com/vcapretz/bull-board) in a small express server.

## Running

```sh
docker run -p 3000:3000 -e REDIS_URL=redis://host.docker.internal patrixr/bullmq-board
```

## Environment variables

- `REDIS_URL` The redis connection string
- `REDIS_SSL` When the redis use SSL
- `BULL_PREFIX` Redis key prefix (defaults to bull)
- `PORT` The port to run on (defaults to 3000)
- `LOGIN_USER` The userlogin (defaults bull)
- `LOGIN_PASSWORD` The user password (defaults board)
- `LOGIN_USERNAME` The username (defaults bull-board)
