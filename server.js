require("dotenv").config();
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN);
const express = require('express');
const bot = require("./bot");
const connectDB = require("./config/db");
const sessionManager = require("./utils/sessionManager");
const winston = require("winston");

const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());

// Basic health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

const logger = winston.createLogger({
  level: "error",
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({
      silent: true,
    }),
  ],
});

process.on("unhandledRejection", (reason, promise) => {});

try {
  if (global.gc) {
    setInterval(() => {
      global.gc();
    }, 30000);
  }
} catch (e) {}

let memoryUsageLog = 0;
setInterval(() => {
  const memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;

  if (Math.abs(memoryUsed - memoryUsageLog) > 20) {
    memoryUsageLog = memoryUsed;
  }
}, 60000);

async function startServer() {
  try {
    await connectDB();
    await sessionManager.initializeSessions();
    await bot.launch();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    process.once("SIGINT", () => {
      bot.stop("SIGINT");
      process.exit(0);
    });
    process.once("SIGTERM", () => {
      bot.stop("SIGTERM");
      process.exit(0);
    });
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

startServer();
