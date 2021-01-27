export default {
  port: process.env.PORT || 8000, // Heroku sets process.env.PORT
  environment: {
    dev: process.env.NODE_ENV === 'development',
    prod: process.env.NODE_ENV === 'production',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  database: {
    url: process.env.DATABASE_URL, // Heroku sets process.env.DATABASE_URL

    name: process.env.DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
  },
};
