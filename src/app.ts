import { Message } from 'telegraf/typings/core/types/typegram';
import TelegramBot from './bot';
import { cleanData } from './services/gemini';
import { Commands } from './types/bot';
import env from './utils/env';



function main() {
  console.log('Starting bot...');
  if (!env.telegramToken) {
    throw new Error('BOT_TOKEN must be provided!');
  }
  const commands: Commands = {
    start: ctx => ctx.reply('Welcome to Publish Bot!'),
    help: ctx => ctx.reply('Help message'),
    recordar: ctx => {
      const message = ctx.message as Message.TextMessage;
      cleanData(message.text || '').then((response) => {
        ctx.reply(response);
      });
    }
  };
  new TelegramBot(env.telegramToken, commands);
}

main();