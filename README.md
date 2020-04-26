# Webhook Buddy Server

## Setup

### Postgres
* `docker pull postgres`
* `docker run --name postgres_webhook_buddy -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=webhook_buddy -d -p 5432:5432 postgres`
* attach and use psql: `docker exec -it postgres_webhook_buddy psql -h localhost -U postgres -d webhook_buddy`
* Add these to `.env`:
  ```
  DATABASE=webhook_buddy
  DATABASE_USER=postgres
  DATABASE_PASSWORD=docker
  DATABASE_HOST=localhost
  DATABASE_PORT=5432
  ```

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

_Note: Nodemon isn't included in debug mode, so stop/start is required to reflect code changes._

## Build
```
npm run build
```
_Deployable build will be in `dist` folder._