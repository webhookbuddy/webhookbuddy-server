# Webhook Buddy Server

## Setup

### Postgres
#### Seeded database (recommended)
* `docker pull johnnyoshika/postgres_webhook_buddy:migration00004`
* `docker run --name postgres_webhook_buddy --env PGDATA=postgres -d -p 5432:5432 johnnyoshika/postgres_webhook_buddy:migration00004`
* attach and use psql: `docker exec -it postgres_webhook_buddy psql -h localhost -U postgres -d webhook_buddy`
#### New database (alternative option)
* https://github.com/johnnyoshika/webhook-buddy-server/wiki/Create-new-dev-database

### Node
* Make sure you're running Node version 12+ (e.g. 12.16.1)
  * Subscriptions won't work with Node version 8 or less
* `npm install`

## Start
```
npm start
```
Navigate to: http://localhost:8000/graphql

## Test user login
* Email: `lou@email.com`
* Password: `1Password`

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

Connect to database with pgAdmin:
* Get DATABASE_URL
```
heroku config
```
DATABASE_URL format is: postgres://`{username}`:`{password}`@`{host}`:`{port}`/`{database}`

Specify these in the `Connection` (Host, Port, Maintenance database, Username) and `Advanced` (DB restriction) tabs. You will be prompted for password once you connect for the first time.
