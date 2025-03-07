import { config } from 'dotenv';

config();

export const env = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN || '',
  geminiAPIKey: process.env.GEMINI_API_KEY || ''
};

export default env;