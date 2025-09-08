import 'reflect-metadata';
import logger from 'core/logger';
import 'infrastructure/config/container';
import app from "./app";
import { connectDB } from "infrastructure/config/database";
import { passportSet } from "infrastructure/config/passportConfig";
import passport = require("passport");
import 'dotenv/config';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await connectDB();

    const passportConfigured = await passportSet();
    if (!passportConfigured) {
      logger.error("❌ Failed to configure Passport.");
      return;
    }

    app.use(passport.initialize());
    
    logger.info(`✅ Server is running on port ${PORT}`)
  } catch (error) {
    logger.error("Database connection failed",error);
  }
});