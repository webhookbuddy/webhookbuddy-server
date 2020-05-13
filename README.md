# Webhook Buddy Server

## Setup

### Environment Variables
Add these to `.env`
  ```
  NODE_ENV=development
  DATABASE=webhook_buddy
  DATABASE_USER=postgres
  DATABASE_PASSWORD=docker
  DATABASE_HOST=localhost
  DATABASE_PORT=5432
  JWT_SECRET={todo}
  ```

### Postgres
* `docker pull postgres`
* `docker run --name postgres_webhook_buddy -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=webhook_buddy -d -p 5432:5432 postgres`
* attach and use psql: `docker exec -it postgres_webhook_buddy psql -h localhost -U postgres -d webhook_buddy`

### Node
* Make sure you're running Node version 12+ (e.g. 12.16.1)
  * Subscriptions won't work with Node version 8 or less
* `npm install`

## Start
```
npm start
```

## Start with Nodemon
```
npm run start:watch
```

## Debug in VS Code
<kbd>F5</kbd>

It may take several attempts with breakpoints near the top of `src/index.ts` with the cursor active at that breakpoint to get VS Code to start in debug mode, but be persistent. Keep trying!

_Note: Nodemon isn't included in debug mode, so stop/start is required to reflect code changes._

## Build
```
npm run build
```
_Deployable build will be in `dist` folder._

## Deployment
```
git push heroku master
```
Ensure JWT_SECRET is set in config
```
heroku config
```
If not, set it:
```
heroku config:set JWT_SECRET={strong secret}
```

View production:
```
heroku open
```