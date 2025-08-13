module.exports = {
    API_BASE_URL: process.env.API_ENDPOINT || 'http://localhost:9000',
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    PORT: process.env.PORT || 9000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || 15,
    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 500,
    CACHE_TTL: process.env.CACHE_TTL || 120
  };